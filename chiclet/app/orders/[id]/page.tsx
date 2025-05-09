"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { useOrdersStore, type Order } from "@/lib/orders"
import { OrderStatus } from "@/components/order-status"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Loader2, Package } from "lucide-react"
import { toast } from "sonner"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuthStore()
  const { orders, cancelOrder } = useOrdersStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push("/signin")
    }

    // Find the order by ID
    if (params.id) {
      const foundOrder = orders.find((o) => o.id === params.id)

      // If order exists and belongs to the current user
      if (foundOrder && user && foundOrder.userId === user.id) {
        setOrder(foundOrder)
      } else if (!isLoading) {
        // Order not found or doesn't belong to user
        router.push("/orders")
      }
    }

    setIsLoading(false)
  }, [params.id, orders, user, isAuthenticated, router, isLoading])

  const handleCancelOrder = () => {
    if (order && order.status === "processing") {
      cancelOrder(order.id)
      setOrder({ ...order, status: "cancelled", updatedAt: new Date().toISOString() })
      toast( "Order cancelled",{
        description: `Order #${order.id} has been cancelled.`,
      })
    } else {
      toast("Cannot cancel order",{
        description: `Orders that have been ${order?.status} cannot be cancelled.`,
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!order) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
              <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <OrderStatus status={order.status} className="text-sm px-3 py-1" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-start">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Tracking Information</h3>
                    <div className="flex items-center">
                      <p className="text-sm">Tracking Number: {order.trackingNumber}</p>
                      <Button variant="ghost" size="sm" asChild className="ml-2">
                        <a
                          href={`https://example.com/track/${order.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Track Package
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {order.status !== "processing" && order.status !== "cancelled" && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Processed</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(new Date(order.createdAt).getTime() + 86400000).toISOString())}
                        </p>
                      </div>
                    </div>
                  )}

                  {(order.status === "shipped" || order.status === "delivered") && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Shipped</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(new Date(order.createdAt).getTime() + 172800000).toISOString())}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Delivered</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium">Order Cancelled</p>
                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border overflow-hidden sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span>${(order.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-3 border-t">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {order.status === "processing" && (
                  <Button
                    onClick={handleCancelOrder}
                    variant="outline"
                    className="w-full mt-6 border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Cancel Order
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    If you have any questions or issues with your order, our customer service team is here to help.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
