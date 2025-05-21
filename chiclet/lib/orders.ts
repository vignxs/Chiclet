import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth"
import { supabase } from "./supabaseClient"

export type OrderStatus = "placed" | "processed" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "paid" | "pending" | "failed"

export type OrderItem = {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  user_id: string
  order_items: OrderItem[]
  total: number
  status: OrderStatus
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
  address_id: number
  tracking_number?: string
}

export type OrderTimelineEntry = {
  status: OrderStatus;
  timestamp: string;
};


type OrdersState = {
  orders: Order[]
  fetchOrders: () => Promise<void>
  addOrder: (userId: string, items: OrderItem[], addressId: number, payment_id: number) => Promise<Order | null>
  cancelOrder: (orderId: string) => void
  getOrdersByUserId: (userId: string) => Order[]
  getOrderTimelineByOrderId: (orderId: string) => Promise<OrderTimelineEntry[] | null>;
}

// Generate a random order ID
const generateOrderId = () => {
  return `ORD-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`
}


export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      fetchOrders: async () => {
        try {
          const user = useAuthStore.getState().user;
          if (!user?.id) {
            console.warn("No authenticated user found.");
            return;
          }

          const { data: orders, error } = await supabase
            .from('orders')
            .select(`
              id,
              user_id,
              address_id,
              total,
              status,
              created_at,
              updated_at,
              tracking_number,
              payment_status,
              order_items (
                id,
                product_id,
                name,
                color,
                price,
                quantity,
                image
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          console.log('Orders with items:', orders);

          if (error) {
            console.error('Error fetching orders with items:', error);
            return;
          }

          set({ orders: orders ?? [] });

        } catch (err) {
          console.error("Unexpected error while fetching orders:", err);
        }
      },

      addOrder: async (userId, items, addressId, payment_id) => {


        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert({
            id: generateOrderId(),
            user_id: userId,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: "processing",
            payment_status: "paid",
            razorpay_payment_id:payment_id,
            address_id: addressId,
          })
          .select()
          .single()

        if (orderError || !newOrder) {
          console.error("Error creating order:", orderError)
          return null
        }

        // Insert order items
        const itemsPayload = items.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }))

        const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload)

        if (itemsError) {
          console.error("Error adding order items:", itemsError)
          return null
        }

        const { error: timrlineError } = await supabase.from("order_timeline").insert({
          order_id: newOrder.id,
          status: "placed",
        })

        if (timrlineError) {
          console.error("Error adding order items timeline:", timrlineError)
          return null
        }
        const fullOrder = {
          ...newOrder,
          order_items: itemsPayload,
        };


        set((state) => ({
          orders: [...state.orders, fullOrder],
        }))

        return newOrder
      },
      cancelOrder: async (orderId) => {

        const { error } = await supabase
          .from("orders")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", orderId)

        if (error) {
          console.error("Error cancelling order:", error)
          return
        }
        await supabase.from("order_timeline").insert({
          order_id: orderId,
          status: "cancelled",
          timestamp: new Date().toISOString(),
        })

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                ...order,
                status: "cancelled",
                updatedAt: new Date().toISOString(),
              }
              : order,
          ),
        }))
      },
      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.user_id === userId)
      },
      getOrderTimelineByOrderId: async (order_id) => {
        const { data, error } = await supabase
          .from("order_timeline")
          .select("status, timestamp")
          .eq("order_id", order_id)
          .order("timestamp", { ascending: true });

        if (error) {
          console.error("Error fetching order timeline:", error);
          return null; // Or handle the error as needed
        }

        return data;
      },
    }),
    {
      name: "chiclet-orders",
    },
  ),
)
