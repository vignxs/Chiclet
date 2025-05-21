"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Clock,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

// Types
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  customer: string
  email: string
  phone: string
  date: string
  total: number
  status: OrderStatus
  items: OrderItem[]
  paymentStatus: "paid" | "pending" | "failed"
  paymentMethod: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  billingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
  notes?: string
  timeline: {
    status: string
    date: string
    note?: string
  }[]
}

// Mock data
const mockOrder: Order = {
  id: "ORD-1234",
  customer: "Jane Smith",
  email: "jane@example.com",
  phone: "+1 (555) 123-4567",
  date: "2023-05-15T10:30:00Z",
  total: 129.99,
  status: "processing",
  paymentStatus: "paid",
  paymentMethod: "Credit Card (Visa ending in 4242)",
  items: [
    { id: 1, name: "Crystal Hair Clips", price: 12.99, quantity: 2, image: "/placeholder.svg" },
    { id: 3, name: "Butterfly Necklace", price: 24.99, quantity: 1, image: "/placeholder.svg" },
    { id: 5, name: "Beaded Bracelet", price: 14.99, quantity: 5, image: "/placeholder.svg" },
  ],
  shippingAddress: {
    name: "Jane Smith",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
  },
  billingAddress: {
    name: "Jane Smith",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
  },
  timeline: [
    { status: "Order Placed", date: "2023-05-15T10:30:00Z" },
    { status: "Payment Confirmed", date: "2023-05-15T10:32:00Z" },
    { status: "Processing", date: "2023-05-15T14:45:00Z", note: "Order is being prepared for shipping" },
  ],
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order>(mockOrder)
  const [isUpdating, setIsUpdating] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update order status
    setOrder((prev) => ({
      ...prev,
      status: newStatus,
      timeline: [
        ...prev.timeline,
        {
          status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          date: new Date().toISOString(),
        },
      ],
    }))

    toast({
      title: "Order updated",
      description: `Order status has been updated to ${newStatus}.`,
    })

    setIsUpdating(false)
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: "paid" | "pending" | "failed") => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        )
    }
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping in this example
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Button variant="ghost" size="sm" className="mb-2" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{order.id}</h1>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-neutral-500 dark:text-neutral-400">Placed on {formatDate(order.date)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Customer
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Order Status</CardTitle>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 font-medium">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <CardDescription>Update the status of this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select
                    defaultValue={order.status}
                    disabled={isUpdating}
                    onValueChange={(value) => handleStatusChange(value as OrderStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && <RefreshCw className="h-4 w-4 animate-spin" />}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Items included in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 py-3 border-b last:border-0">
                      <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center flex-shrink-0 dark:bg-neutral-800">
                        <Package className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          ₹{item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-right">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>History of this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-900/10 flex items-center justify-center dark:bg-neutral-50/10">
                          <Clock className="h-4 w-4 text-neutral-900 dark:text-neutral-50" />
                        </div>
                        {index < order.timeline.length - 1 && <div className="w-0.5 h-full bg-neutral-200 mt-1 dark:bg-neutral-800" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-medium">{event.status}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(event.date)}</div>
                        {event.note && <div className="mt-1 text-sm bg-neutral-100 p-2 rounded-md dark:bg-neutral-800">{event.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Payment Status</span>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">Payment Method</div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                  <span>{order.paymentMethod}</span>
                </div>
              </CardFooter>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="flex items-center text-sm text-neutral-500 mt-1 dark:text-neutral-400">
                      <Mail className="h-4 w-4 mr-1" />
                      {order.email}
                    </div>
                    <div className="flex items-center text-sm text-neutral-500 mt-1 dark:text-neutral-400">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.phone}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium mb-1">Shipping Address</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <div>{order.shippingAddress.name}</div>
                      <div>{order.shippingAddress.street}</div>
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </div>
                      <div>{order.shippingAddress.country}</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="font-medium mb-1">Billing Address</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      <div>{order.billingAddress.name}</div>
                      <div>{order.billingAddress.street}</div>
                      <div>
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                      </div>
                      <div>{order.billingAddress.country}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
              </CardFooter>
            </Card>

            {/* Shipping Information */}
            {order.status === "shipped" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium">Tracking Number</div>
                      <div className="text-sm mt-1">{order.trackingNumber || "Not available"}</div>
                    </div>
                    {order.trackingNumber && (
                      <Button variant="outline" className="w-full mt-2">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{order.notes || "No notes for this order."}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Add Note
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
