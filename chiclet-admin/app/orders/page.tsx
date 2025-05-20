"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer,
  RefreshCw,
  ChevronRight,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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
  date: string
  total: number
  status: OrderStatus
  items: OrderItem[]
  paymentStatus: "paid" | "pending" | "failed"
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "ORD-1234",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-05-15T10:30:00Z",
    total: 129.99,
    status: "processing",
    paymentStatus: "paid",
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
  },
  {
    id: "ORD-1233",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-05-14T14:45:00Z",
    total: 79.95,
    status: "shipped",
    paymentStatus: "paid",
    items: [
      { id: 2, name: "Pearl Earrings", price: 18.99, quantity: 1, image: "/placeholder.svg" },
      { id: 6, name: "Charm Anklet", price: 16.99, quantity: 1, image: "/placeholder.svg" },
      { id: 4, name: "Scrunchie Set", price: 9.99, quantity: 2, image: "/placeholder.svg" },
    ],
    shippingAddress: {
      name: "John Doe",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
  },
  {
    id: "ORD-1232",
    customer: "Alice Johnson",
    email: "alice@example.com",
    date: "2023-05-14T09:15:00Z",
    total: 149.5,
    status: "delivered",
    paymentStatus: "paid",
    items: [
      { id: 3, name: "Butterfly Necklace", price: 24.99, quantity: 2, image: "/placeholder.svg" },
      { id: 5, name: "Beaded Bracelet", price: 14.99, quantity: 3, image: "/placeholder.svg" },
      { id: 1, name: "Crystal Hair Clips", price: 12.99, quantity: 1, image: "/placeholder.svg" },
    ],
    shippingAddress: {
      name: "Alice Johnson",
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60007",
      country: "USA",
    },
  },
  {
    id: "ORD-1231",
    customer: "Bob Brown",
    email: "bob@example.com",
    date: "2023-05-13T16:20:00Z",
    total: 59.99,
    status: "processing",
    paymentStatus: "pending",
    items: [
      { id: 4, name: "Scrunchie Set", price: 9.99, quantity: 1, image: "/placeholder.svg" },
      { id: 2, name: "Pearl Earrings", price: 18.99, quantity: 2, image: "/placeholder.svg" },
    ],
    shippingAddress: {
      name: "Bob Brown",
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
    },
  },
  {
    id: "ORD-1230",
    customer: "Emma Wilson",
    email: "emma@example.com",
    date: "2023-05-12T11:10:00Z",
    total: 89.97,
    status: "cancelled",
    paymentStatus: "failed",
    items: [
      { id: 6, name: "Charm Anklet", price: 16.99, quantity: 3, image: "/placeholder.svg" },
      { id: 1, name: "Crystal Hair Clips", price: 12.99, quantity: 3, image: "/placeholder.svg" },
    ],
    shippingAddress: {
      name: "Emma Wilson",
      street: "654 Maple Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter orders based on search term and status
  const filteredOrders = mockOrders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter),
  )

  // Sort orders by date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(sortedOrders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId])
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId))
    }
  }

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleBulkStatusChange = async (newStatus: OrderStatus) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No orders selected",
        description: "Please select at least one order to update.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would update the orders in your database
    toast({
      title: "Orders updated",
      description: `${selectedOrders.length} orders have been updated to ${newStatus}.`,
    })

    setIsLoading(false)
    setSelectedOrders([])
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`)
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

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage and process customer orders</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.refresh()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{selectedOrders.length} selected</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Edit className="h-4 w-4 mr-2" />
                    )}
                    Update Status
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkStatusChange("processing")}>
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange("shipped")}>
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange("delivered")}>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkStatusChange("cancelled")}>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Orders Table */}
        {sortedOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-neutral-100 p-3 mb-3 dark:bg-neutral-800">
                <Package className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No orders found</h3>
              <p className="text-sm text-neutral-500 mb-4 dark:text-neutral-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "When you receive orders, they will appear here"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedOrders.length === sortedOrders.length && sortedOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <>
                    <TableRow key={order.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 mr-2 p-0"
                            onClick={() => handleToggleExpand(order.id)}
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                expandedOrders.includes(order.id) ? "rotate-90" : ""
                              }`}
                            />
                          </Button>
                          {order.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{order.customer}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{order.email}</div>
                      </TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedOrders.includes(order.id) && (
                      <TableRow className="bg-neutral-100/50 dark:bg-neutral-800/50">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-4">
                            <h4 className="font-medium mb-2">Order Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-md dark:bg-neutral-950">
                                  <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center dark:bg-neutral-800">
                                    <Package className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{item.name}</div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                      ${item.price.toFixed(2)} × {item.quantity}
                                    </div>
                                  </div>
                                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div>
                                <h4 className="font-medium mb-1">Shipping Address</h4>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                  <div>{order.shippingAddress.name}</div>
                                  <div>{order.shippingAddress.street}</div>
                                  <div>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{""}
                                    {order.shippingAddress.zip}
                                  </div>
                                  <div>{order.shippingAddress.country}</div>
                                </div>
                              </div>
                              <Button variant="outline" onClick={() => handleViewOrder(order.id)}>
                                View Full Details
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
