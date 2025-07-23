import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "./supabase"

// Dashboard Analytics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [ordersResult, productsResult, paymentsResult, cartItemsResult] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("products").select("*"),
        supabase.from("payments").select("*"),
        supabase.from("cart_items").select("*"),
      ])

      const totalOrders = ordersResult.data?.length || 0
      const totalProducts = productsResult.data?.length || 0
      const totalRevenue = paymentsResult.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0
      const activeCartItems = cartItemsResult.data?.length || 0

      // Recent orders for chart
      const recentOrders =
        ordersResult.data?.slice(-7).map((order) => ({
          date: new Date(order.created_at!).toLocaleDateString(),
          orders: 1,
          revenue: Number(order.total),
        })) || []

      return {
        totalOrders,
        totalProducts,
        totalRevenue,
        activeCartItems,
        recentOrders,
      }
    },
  })
}

// Orders
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*),
          user_addresses(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export const useOrderTimeline = (orderId: string) => {
  return useQuery({
    queryKey: ["order-timeline", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_timeline")
        .select("*")
        .eq("order_id", orderId)
        .order("timestamp", { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!orderId,
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      // Update order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (orderError) throw orderError

      // Add timeline entry
      const { error: timelineError } = await supabase.from("order_timeline").insert({ order_id: orderId, status })

      if (timelineError) throw timelineError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order-timeline"] })
    },
  })
}

// Products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: any) => {
      const { data, error } = await supabase.from("products").insert(product).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

// Payments
export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*").order("paid_at", { ascending: false })

      if (error) throw error
      return data
    },
  })
}

// Cart Items
export const useCartItems = () => {
  return useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cart_items").select("*").order("id", { ascending: false })

      if (error) throw error
      return data
    },
  })
}
