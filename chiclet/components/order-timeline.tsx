import type { OrderStatus } from "@/lib/orders"
import type React from "react"

interface OrderTimelineEntry {
  status: OrderStatus
  timestamp: string
}

interface OrderTimelineProps {
  ordersTimeline: OrderTimelineEntry[] | null
}

const statusColorMap: Record<OrderStatus, string> = {
   placed: "bg-green-500",
   processed: "bg-green-500",
  processing: "bg-yellow-500",
  shipped: "bg-blue-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
}

const statusLabelMap: Record<OrderStatus, string> = {
  processing: "Order Processing",
  processed: "Order Processed",
  placed: "Order Placed",
  shipped: "Order Shipped",
  delivered: "Order Delivered",
  cancelled: "Order Cancelled",
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ ordersTimeline }) => {
  if (!ordersTimeline || ordersTimeline.length === 0) {
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
          <p className="text-gray-500">No timeline information available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
        <div className="space-y-4">
          {ordersTimeline.map((entry, index) => {
            const isLast = index === ordersTimeline.length - 1
            const dotColor = statusColorMap[entry.status]
            const label = statusLabelMap[entry.status]

            return (
              <div className="flex" key={index}>
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-3 h-3 ${dotColor} rounded-full`}></div>
                  {!isLast && <div className="w-0.5 h-full bg-gray-200"></div>}
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-500">{formatDate(entry.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OrderTimeline
