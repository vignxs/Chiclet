import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Address } from "./address-store"

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "paid" | "pending" | "failed"

export type OrderItem = {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  addressId: number
  shippingAddress: Address
  trackingNumber?: string
}

type OrdersState = {
  orders: Order[]
  addOrder: (userId: string, items: OrderItem[], addressId: number, shippingAddress: Address) => Order
  cancelOrder: (orderId: string) => void
  getOrdersByUserId: (userId: string) => Order[]
}

// Generate a random order ID
const generateOrderId = () => {
  return `ORD-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`
}

// Sample mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "ORD-1234-5678",
    userId: "google-oauth2|123456789",
    items: [
      {
        id: 1,
        productId: 1,
        name: "Crystal Hair Clips",
        price: 12.99,
        quantity: 2,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        productId: 3,
        name: "Butterfly Necklace",
        price: 24.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    total: 50.97,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-18T14:20:00Z",
    addressId: 1,
    shippingAddress: {
      id: 1,
      userId: "google-oauth2|123456789",
      name: "Home",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      createdAt: "2023-01-15T10:30:00Z",
    },
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-5678-9012",
    userId: "google-oauth2|123456789",
    items: [
      {
        id: 3,
        productId: 5,
        name: "Beaded Bracelet",
        price: 14.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    total: 14.99,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2023-05-20T15:45:00Z",
    updatedAt: "2023-05-21T09:10:00Z",
    addressId: 2,
    shippingAddress: {
      id: 2,
      userId: "google-oauth2|123456789",
      name: "Work",
      street: "456 Business Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
      createdAt: "2023-03-20T14:45:00Z",
    },
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-9012-3456",
    userId: "google-oauth2|123456789",
    items: [
      {
        id: 4,
        productId: 2,
        name: "Pearl Earrings",
        price: 18.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        productId: 6,
        name: "Charm Anklet",
        price: 16.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    total: 35.98,
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2023-06-10T12:15:00Z",
    updatedAt: "2023-06-10T12:15:00Z",
    addressId: 1,
    shippingAddress: {
      id: 1,
      userId: "google-oauth2|123456789",
      name: "Home",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      createdAt: "2023-01-15T10:30:00Z",
    },
  },
]

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      addOrder: (userId, items, addressId, shippingAddress) => {
        const newOrder: Order = {
          id: generateOrderId(),
          userId,
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: "processing",
          paymentStatus: "paid", // Assuming payment is successful
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          addressId,
          shippingAddress,
        }

        set((state) => ({
          orders: [...state.orders, newOrder],
        }))

        return newOrder
      },
      cancelOrder: (orderId) => {
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
        return get().orders.filter((order) => order.userId === userId)
      },
    }),
    {
      name: "chiclet-orders",
    },
  ),
)
