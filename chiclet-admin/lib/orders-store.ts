import { create } from "zustand"
import { supabase } from "./supabaseClient"

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "paid" | "pending" | "failed"

export interface OrderItem {
  id: number
  order_id: string
  product_id: number
  name: string
  color: string | null
  price: number
  quantity: number
  image: string | null
}

export interface OrderTimeline {
  id: number
  order_id: string
  status: string
  timestamp: string
}

export interface Order {
  id: string
  user_id: string
  address_id: number
  total: number
  status: OrderStatus
  created_at: string
  updated_at: string
  tracking_number: string | null
  payment_status: PaymentStatus
  items?: OrderItem[]
  timeline?: OrderTimeline[]
  address?: {
    id: number
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

interface OrdersState {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  fetchOrdersByUserId: (userId: string) => Promise<Order[]>
  getOrderById: (id: string) => Promise<Order | null>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>
  addOrderTimelineEvent: (orderId: string, status: string) => Promise<boolean>
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      // Fetch order items for all orders
      const { data: items, error: itemsError } = await supabase.from("order_items").select("*")

      if (itemsError) throw itemsError

      // Fetch order timeline events
      const { data: timeline, error: timelineError } = await supabase
        .from("order_timeline")
        .select("*")
        .order("timestamp", { ascending: true })

      if (timelineError) throw timelineError

      // Fetch addresses
      const { data: addresses, error: addressesError } = await supabase.from("user_addresses").select("*")

      if (addressesError) throw addressesError

      // Combine orders with their items, timeline, and address
      const ordersWithDetails = orders.map((order: Order) => ({
        ...order,
        items: items.filter((item: OrderItem) => item.order_id === order.id),
        timeline: timeline.filter((event: OrderTimeline) => event.order_id === order.id),
        address: addresses.find((addr: any) => addr.id === order.address_id),
      }))

      set({ orders: ordersWithDetails, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error fetching orders:", error)
    }
  },

  fetchOrdersByUserId: async (userId: string) => {
    try {
      // Fetch orders for the user
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (ordersError) throw ordersError

      // Fetch order items for these orders
      const orderIds = orders.map((order: Order) => order.id)

      if (orderIds.length === 0) return []

      const { data: items, error: itemsError } = await supabase.from("order_items").select("*").in("order_id", orderIds)

      if (itemsError) throw itemsError

      // Fetch order timeline events
      const { data: timeline, error: timelineError } = await supabase
        .from("order_timeline")
        .select("*")
        .in("order_id", orderIds)
        .order("timestamp", { ascending: true })

      if (timelineError) throw timelineError

      // Fetch addresses
      const addressIds = orders.map((order: Order) => order.address_id).filter(Boolean)

      let addresses: any[] = []
      if (addressIds.length > 0) {
        const { data: addressData, error: addressesError } = await supabase
          .from("user_addresses")
          .select("*")
          .in("id", addressIds)

        if (addressesError) throw addressesError
        addresses = addressData
      }

      // Combine orders with their items, timeline, and address
      const ordersWithDetails = orders.map((order: Order) => ({
        ...order,
        items: items.filter((item: OrderItem) => item.order_id === order.id),
        timeline: timeline.filter((event: OrderTimeline) => event.order_id === order.id),
        address: addresses.find((addr: any) => addr.id === order.address_id),
      }))

      return ordersWithDetails
    } catch (error) {
      console.error("Error fetching orders by user ID:", error)
      return []
    }
  },

  getOrderById: async (id: string) => {
    try {
      // Fetch the order
      const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", id).single()

      if (orderError) throw orderError

      // Fetch order items
      const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", id)

      if (itemsError) throw itemsError

      // Fetch order timeline
      const { data: timeline, error: timelineError } = await supabase
        .from("order_timeline")
        .select("*")
        .eq("order_id", id)
        .order("timestamp", { ascending: true })

      if (timelineError) throw timelineError

      // Fetch address if available
      let address = null
      if (order.address_id) {
        const { data: addressData, error: addressError } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("id", order.address_id)
          .single()

        if (!addressError) {
          address = addressData
        }
      }

      return {
        ...order,
        items,
        timeline,
        address,
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      return null
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    set({ isLoading: true, error: null })
    try {
      // Update the order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (orderError) throw orderError

      // Add a timeline event
      await get().addOrderTimelineEvent(id, status)

      // Refresh orders list
      await get().fetchOrders()

      set({ isLoading: false })
      return true
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error updating order status:", error)
      return false
    }
  },

  addOrderTimelineEvent: async (orderId: string, status: string) => {
    try {
      const { error } = await supabase.from("order_timeline").insert([
        {
          order_id: orderId,
          status,
          timestamp: new Date().toISOString(),
        },
      ])

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error adding timeline event:", error)
      return false
    }
  },
}))
