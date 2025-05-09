import type { OrderStatus } from "@/lib/orders"
import { CheckCircle, Clock, Package, XCircle } from "lucide-react"

interface OrderStatusProps {
  status: OrderStatus
  className?: string
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  const getStatusDetails = () => {
    switch (status) {
      case "processing":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Processing",
          color: "bg-yellow-100 text-yellow-800",
        }
      case "shipped":
        return {
          icon: <Package className="h-4 w-4" />,
          label: "Shipped",
          color: "bg-blue-100 text-blue-800",
        }
      case "delivered":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Delivered",
          color: "bg-green-100 text-green-800",
        }
      case "cancelled":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
          color: "bg-red-100 text-red-800",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
        }
    }
  }

  const { icon, label, color } = getStatusDetails()

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {icon}
      <span className="ml-1">{label}</span>
    </div>
  )
}
