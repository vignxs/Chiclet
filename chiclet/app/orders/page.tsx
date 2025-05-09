"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { useOrdersStore, type Order } from "@/lib/orders"
import { OrderCard } from "@/components/order-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Package, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { getOrdersByUserId } = useOrdersStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push("/signin")
    }

    // Get orders for the current user
    if (user) {
      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user, isAuthenticated, getOrdersByUserId, router, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const processingOrders = orders.filter((order) => order.status === "processing")
  const shippedOrders = orders.filter((order) => order.status === "shipped")
  const deliveredOrders = orders.filter((order) => order.status === "delivered")
  const cancelledOrders = orders.filter((order) => order.status === "cancelled")

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-1">View and manage your orders</p>
          </div>
          <Button asChild>
            <a href="/shop">Continue Shopping</a>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our collection and find something you'll love!
            </p>
            <Button className="mt-6" asChild>
              <a href="/shop">Start Shopping</a>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                All ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="processing" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Processing ({processingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="shipped" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Shipped ({shippedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="delivered" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Delivered ({deliveredOrders.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelled ({cancelledOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-6">
              {processingOrders.length > 0 ? (
                processingOrders.map((order) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-8 text-gray-500">No processing orders</div>
              )}
            </TabsContent>

            <TabsContent value="shipped" className="space-y-6">
              {shippedOrders.length > 0 ? (
                shippedOrders.map((order) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-8 text-gray-500">No shipped orders</div>
              )}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-6">
              {deliveredOrders.length > 0 ? (
                deliveredOrders.map((order) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-8 text-gray-500">No delivered orders</div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="text-center py-8 text-gray-500">No cancelled orders</div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
