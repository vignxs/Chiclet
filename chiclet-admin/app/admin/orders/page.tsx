/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, Filter, Download, ArrowUpDown } from "lucide-react"
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all",
    dateFrom: "",
    dateTo: "",
  })
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc" as "asc" | "desc",
  })

  // Use the basic orders query instead of the filtered one for now
  const { data: allOrders, isLoading } = useOrders()
  const { data: timeline } = useOrderTimeline(selectedOrderId || "")
  const updateOrderStatus = useUpdateOrderStatus()

  // Apply filters and sorting on the client side
  const filteredAndSortedOrders = allOrders
    ?.filter((order) => {
      if (filters.status !== "all" && order.status !== filters.status) return false
      if (filters.paymentStatus !== "all" && order.payment_status !== filters.paymentStatus) return false
      if (filters.dateFrom && order.created_at && new Date(order.created_at) < new Date(filters.dateFrom)) return false
      if (filters.dateTo && order.created_at && new Date(order.created_at) > new Date(filters.dateTo)) return false
      return true
    })
    ?.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a]
      let bValue: any = b[sortConfig.key as keyof typeof b]

      // Handle different data types
      if (sortConfig.key === "total") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortConfig.key === "created_at") {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      paymentStatus: "all",
      dateFrom: "",
      dateTo: "",
    })
  }

  const exportToCSV = () => {
    if (!filteredAndSortedOrders) return

    const csvData = filteredAndSortedOrders.map((order) => ({
      "Order ID": order.id,
      Customer: order.user_addresses?.name || "N/A",
      Total: Number(order.total).toFixed(2),
      Status: order.status,
      "Payment Status": order.payment_status || "pending",
      Date: order.created_at ? format(new Date(order.created_at), "yyyy-MM-dd") : "N/A",
      "Tracking Number": order.tracking_number || "N/A",
    }))

    const csvContent = [Object.keys(csvData[0]).join(","), ...csvData.map((row) => Object.values(row).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      key: column,
      direction: prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }))
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="flex items-center space-x-2 bg-transparent">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Filters & Sorting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="placed">Placed</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment-filter">Payment Status</Label>
                  <Select
                    value={filters.paymentStatus}
                    onValueChange={(value) => handleFilterChange("paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All payments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All payments</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-from">From Date</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="date-to">To Date</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Orders ({filteredAndSortedOrders?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center space-x-1 font-semibold hover:text-[#2568AC]"
                    >
                      <span>Order ID</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("total")}
                      className="flex items-center space-x-1 font-semibold hover:text-[#2568AC]"
                    >
                      <span>Total</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center space-x-1 font-semibold hover:text-[#2568AC]"
                    >
                      <span>Status</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("created_at")}
                      className="flex items-center space-x-1 font-semibold hover:text-[#2568AC]"
                    >
                      <span>Date</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No orders found.{" "}
                      {allOrders?.length === 0 ? "Try running the seed data script." : "Try adjusting your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedOrders?.map((order) => {
                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] ?? Clock
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.user_addresses?.name || "N/A"}</TableCell>
                        <TableCell>₹{Number(order.total).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[order.status as keyof typeof statusColors] ?? "bg-gray-100 text-gray-800"
                            }
                          >
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
                                        {order.order_items?.map((item: {
                                          id: string;
                                          name: string;
                                          quantity: number;
                                          price: number;
                                        }) => (
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
                                      const TimelineIcon =
                                        statusIcons[entry.status as keyof typeof statusIcons] ?? Clock
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
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
