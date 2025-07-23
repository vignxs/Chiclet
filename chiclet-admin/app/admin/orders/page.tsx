"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useOrders, useOrderTimeline, useUpdateOrderStatus } from "@/lib/queries"
import { format } from "date-fns"

const statusIcons = {
  placed: Clock,
  processed: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusColors = {
  placed: "bg-yellow-100 text-yellow-800",
  processed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const { data: timeline } = useOrderTimeline(selectedOrderId || "")
  const updateOrderStatus = useUpdateOrderStatus()

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.user_addresses?.name || "N/A"}</TableCell>
                      <TableCell>₹{Number(order.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                          {order.payment_status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Order Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">Order Information</h3>
                                    <p>
                                      <strong>Total:</strong> ₹{Number(order.total).toFixed(2)}
                                    </p>
                                    <p>
                                      <strong>Status:</strong> {order.status}
                                    </p>
                                    <p>
                                      <strong>Payment:</strong> {order.payment_status || "pending"}
                                    </p>
                                    <p>
                                      <strong>Tracking:</strong> {order.tracking_number || "Not assigned"}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">Customer Address</h3>
                                    {order.user_addresses && (
                                      <div className="text-sm">
                                        <p>{order.user_addresses.name}</p>
                                        <p>{order.user_addresses.street}</p>
                                        <p>
                                          {order.user_addresses.city}, {order.user_addresses.state}
                                        </p>
                                        <p>
                                          {order.user_addresses.zip}, {order.user_addresses.country}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h3 className="font-semibold mb-2">Order Items</h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.order_items?.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Timeline */}
                                <div>
                                  <h3 className="font-semibold mb-2">Order Timeline</h3>
                                  <div className="space-y-2">
                                    {timeline?.map((entry) => {
                                      const TimelineIcon = statusIcons[entry.status as keyof typeof statusIcons]
                                      return (
                                        <div key={entry.id} className="flex items-center space-x-3">
                                          <TimelineIcon className="w-4 h-4 text-[#2568AC]" />
                                          <span className="capitalize">{entry.status}</span>
                                          <span className="text-sm text-gray-500">
                                            {format(new Date(entry.timestamp), "MMM dd, yyyy HH:mm")}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Status Update */}
                                <div>
                                  <h3 className="font-semibold mb-2">Update Status</h3>
                                  <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                                    <SelectTrigger className="w-48">
                                      <SelectValue placeholder="Select new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="placed">Placed</SelectItem>
                                      <SelectItem value="processed">Processed</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
