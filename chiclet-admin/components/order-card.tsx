"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Order } from "@/lib/orders"
import { OrderStatus } from "@/components/order-status"
import { Button } from "@/components/ui/button"
import { useOrdersStore } from "@/lib/orders"
import { ChevronDown, ChevronUp, ExternalLink, Loader2, Package } from "lucide-react"
import { toast } from "sonner"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {

  console.log("OrderCard rendered with order:", order)
  const [isExpanded, setIsExpanded] = useState(false)
  const { cancelOrder } = useOrdersStore()


  const handleCancelOrder = () => {
    if (order.status === "processing") {
      cancelOrder(order.id)
      toast("Order cancelled", {
        description: `Order #${order.id} has been cancelled.`,
      })
    } else {
      toast("Cannot cancel order", {
        description: `Orders that have been ${order.status} cannot be cancelled.`,
      })
    }
  }

  const formatDate = (dateString: string) => {
    console.log("Formatting date:", dateString)
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }



  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">Order #{order.id}</h3>
              <OrderStatus status={order.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.created_at)}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="font-medium">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          {order.order_items.slice(0, isExpanded ? order.order_items.length : 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
            </div>
          ))}
          {!isExpanded && order.order_items.length > 2 && (
            <div className="flex items-center text-sm text-gray-500">+{order.order_items.length - 2} more items</div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {order.status === "processing" && (
              <Button variant="outline" size="sm" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            )}
            {order.tracking_number && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`https://example.com/track/${order.tracking_number}`} target="_blank">
                  <Package className="h-4 w-4 mr-1" />
                  Track Package
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/orders/${order.id}`}>View Details</Link>
            </Button>
          </div>
          {order.order_items.length > 2 && (
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show All
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
