"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { useDashboardStore } from "@/lib/dashboard-store"
import { Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const { user, isAuthenticated, isAuthLoading  } = useAuthStore()
  const { stats, fetchDashboardStats } = useDashboardStore()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
       if (isAuthLoading) return
      // Only run after user and isAuthenticated are ready
      if (user === null && isAuthenticated) return // edge case
      if (!user || !isAuthenticated) {
        router.push("/signin?redirect=/")
        return
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (error) throw error

        const isAdmin = data?.role === "admin"
        console.log("User role:", data?.role)
        setIsAuthorized(isAdmin)

        if (!isAdmin) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          router.push("/")
        } else {
          fetchDashboardStats()
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        toast({
          title: "Error",
          description: "Failed to verify your permissions. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsAuthChecking(false)
      }
    }

    // only run when we have clarity on auth
    if (user !== undefined && isAuthenticated !== undefined) {
      checkAuth()
    }
  }, [user, isAuthenticated, router, toast, fetchDashboardStats])

  // Loading state
  if (isAuthChecking || stats.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthorized) return null // Already redirected

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Overview of your store performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>View Analytics</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <div className="flex items-center pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="text-red-500 flex items-center mr-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {stats.lowStockProducts}
                </span>
                <span>low stock items</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <div className="flex items-center pt-1 text-xs">
                <span
                  className={`flex items-center mr-1 ${stats.ordersChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stats.ordersChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.ordersChange)}%
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                <span
                  className={`flex items-center mr-1 ${stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stats.revenueChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.revenueChange)}%
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <div className="pt-1">
                <Link
                  href="/orders?status=processing"
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
                >
                  View pending orders
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{order.customer}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.total.toFixed(2)}</div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No recent orders</div>
                )}
              </div>
              <div className="mt-4">
                <Link href="/orders" className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                  View all orders
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.lowStockItems.length > 0 ? (
                  stats.lowStockItems.map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{product.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${product.price.toFixed(2)}</div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-block ${product.stock <= 2 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {product.stock} in stock
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-neutral-500 dark:text-neutral-400">No low stock products</div>
                )}
              </div>
              <div className="mt-4">
                <Link href="/products" className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                  Manage products
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
