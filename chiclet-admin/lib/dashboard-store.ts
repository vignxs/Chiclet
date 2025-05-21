import { create } from "zustand"
import { supabase } from "./supabaseClient"

type DashboardStats = {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  lowStockProducts: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number
  recentOrders: RecentOrder[]
  lowStockItems: LowStockItem[]
  isLoading: boolean
}

type RecentOrder = {
  id: string
  date: string
  customer: string
  total: number
  status: string
}

type LowStockItem = {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

type DashboardStore = {
  stats: DashboardStats
  fetchDashboardStats: () => Promise<void>
}

const initialStats: DashboardStats = {
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  lowStockProducts: 0,
  pendingOrders: 0,
  revenueChange: 0,
  ordersChange: 0,
  recentOrders: [],
  lowStockItems: [],
  isLoading: false,
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: initialStats,
  fetchDashboardStats: async () => {
    set((state) => ({ stats: { ...state.stats, isLoading: true } }))

    try {
      // Fetch total products
      const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

      // Fetch total orders
      const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

      // Fetch pending orders
      const { count: pendingOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "processing")

      // Fetch total revenue
      const { data: revenueData } = await supabase.from("orders").select("total")

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number.parseFloat(order.total), 0) || 0

      // Fetch recent orders with customer names
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          status,
          created_at,
          user_id
        `)
        .order("created_at", { ascending: false })
        .limit(4)

      // Get user profiles for the orders
      const userIds = recentOrdersData?.map((order) => order.user_id) || []
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name").in("id", userIds)

      // Map profiles to orders
      const profilesMap = new Map()
      profilesData?.forEach((profile) => {
        profilesMap.set(profile.id, profile.full_name)
      })

      const recentOrders =
        recentOrdersData?.map((order) => ({
          id: order.id,
          date: new Date(order.created_at).toISOString().split("T")[0],
          customer: profilesMap.get(order.user_id) || "Unknown",
          total: Number.parseFloat(order.total),
          status: order.status,
        })) || []

      // Fetch low stock products (for demo, we'll consider any product as low stock)
      const { data: lowStockData } = await supabase.from("products").select("id, name, category, price").limit(4)

      const lowStockItems =
        lowStockData?.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category || "Uncategorized",
          price: Number.parseFloat(product.price),
          stock: Math.floor(Math.random() * 5) + 1, // Random stock between 1-5 for demo
        })) || []

      // For demo purposes, generate random change percentages
      const revenueChange = Number.parseFloat((Math.random() * 20 - 5).toFixed(1))
      const ordersChange = Number.parseFloat((Math.random() * 20 - 5).toFixed(1))

      set({
        stats: {
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue,
          lowStockProducts: lowStockItems.length,
          pendingOrders: pendingOrders || 0,
          revenueChange,
          ordersChange,
          recentOrders,
          lowStockItems,
          isLoading: false,
        },
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      set((state) => ({ stats: { ...state.stats, isLoading: false } }))
    }
  },
}))
