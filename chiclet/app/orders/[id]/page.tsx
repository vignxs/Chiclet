"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { OrderTimelineEntry, useOrdersStore, type Order } from "@/lib/orders"
import { OrderStatus } from "@/components/order-status"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Loader2, Package } from "lucide-react"
import { toast } from "sonner"
import OrderTimeline from "@/components/order-timeline"

type Params = {
  id: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default function OrderDetailsPage({ params }: PageProps) {
  const { user, isAuthenticated } = useAuthStore()
  const { orders, cancelOrder } = useOrdersStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const orderId = use(params).id;
  const { getOrderTimelineByOrderId } = useOrdersStore()
  const [ordersTimeline, setOrdersTimeline] = useState<OrderTimelineEntry[] | null>([]);

  console.log("Order ID from params:", orderId)
  console.log("Orders from store:", orders)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrderTimelineByOrderId(orderId);
      console.log("Fetched data:", data);
      setOrdersTimeline(data);
    };

    console.log("Authenticated user:", isAuthenticated);
    const processOrder = async () => {
      // if (!isAuthenticated) {
      //   router.push("/signin");
      //   return;
      // }

      if (orderId) {
        const foundOrder = orders.find((o) => o.id === orderId);
        if (foundOrder && user && foundOrder.user_id === user.id) {
          setOrder(foundOrder);

          console.log("Found order:", foundOrder);
          await fetchData();
        } else {
          router.push("/orders");
          return;
        }
      }

      setIsLoading(false);
    };

    processOrder();
  }, [orderId, orders, user, isAuthenticated, router]);

  const handleCancelOrder = () => {
    if (order && order.status === "processing") {
      cancelOrder(order.id)
      setOrder({ ...order, status: "cancelled", updated_at: new Date().toISOString() })
      toast("Order cancelled", {
        description: `Order #${order.id} has been cancelled.`,
      })
    } else {
      toast("Cannot cancel order", {
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
              <p className="text-gray-500 mt-1">Placed on {formatDate(order.created_at)}</p>
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
                  {order.order_items.map((item) => (
                    <div key={item.product_id} className="py-4 flex items-start">
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
                {/* <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div> */}

                {order.tracking_number && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Tracking Information</h3>
                    <div className="flex items-center">
                      <p className="text-sm">Tracking Number: {order.tracking_number}</p>
                      <Button variant="ghost" size="sm" asChild className="ml-2">
                        <a
                          href={`https://example.com/track/${order.tracking_number}`}
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
            <OrderTimeline ordersTimeline={ordersTimeline} />
          </div>
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border overflow-hidden sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
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
