"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  Tag,
  Gift,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  totalSpent: number
  totalOrders: number
  lastOrderDate: string
  lastOrderAmount: number
  status: "active" | "inactive"
  segment: "new" | "returning" | "loyal" | "at-risk" | "lost"
  joinDate: string
  avatar: string | null
  notes: string | null
}

// Mock order data
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-05-15T10:30:00Z",
    status: "delivered",
    total: 129.99,
    items: [
      { id: 1, name: "Crystal Hair Clips", quantity: 2, price: 12.99 },
      { id: 3, name: "Butterfly Necklace", quantity: 1, price: 24.99 },
      { id: 5, name: "Beaded Bracelet", quantity: 1, price: 14.99 },
    ],
  },
  {
    id: "ORD-1235",
    date: "2023-04-02T14:15:00Z",
    status: "delivered",
    total: 89.98,
    items: [
      { id: 2, name: "Pearl Earrings", quantity: 1, price: 18.99 },
      { id: 6, name: "Charm Anklet", quantity: 1, price: 16.99 },
    ],
  },
  {
    id: "ORD-1236",
    date: "2023-03-10T09:45:00Z",
    status: "delivered",
    total: 210.0,
    items: [
      { id: 4, name: "Scrunchie Set", quantity: 2, price: 9.99 },
      { id: 7, name: "Gold Plated Necklace", quantity: 1, price: 49.99 },
    ],
  },
]

// Mock activity data
const mockActivity = [
  {
    id: 1,
    type: "order",
    description: "Placed order #ORD-1234",
    date: "2023-05-15T10:30:00Z",
  },
  {
    id: 2,
    type: "login",
    description: "Logged in to account",
    date: "2023-05-15T10:25:00Z",
  },
  {
    id: 3,
    type: "cart",
    description: "Added 3 items to cart",
    date: "2023-05-15T10:20:00Z",
  },
  {
    id: 4,
    type: "wishlist",
    description: "Added 'Gold Plated Necklace' to wishlist",
    date: "2023-05-14T16:45:00Z",
  },
  {
    id: 5,
    type: "order",
    description: "Placed order #ORD-1235",
    date: "2023-04-02T14:15:00Z",
  },
]

interface CustomerDetailsProps {
  customer: Customer
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState(customer.notes || "")

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const getSegmentBadge = (segment: Customer["segment"]) => {
    switch (segment) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            New
          </Badge>
        )
      case "returning":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Returning
          </Badge>
        )
      case "loyal":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Loyal
          </Badge>
        )
      case "at-risk":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            At Risk
          </Badge>
        )
      case "lost":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Lost
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Delivered
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Shipped
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Processing
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4" />
      case "login":
        return <CheckCircle2 className="h-4 w-4" />
      case "cart":
        return <ShoppingBag className="h-4 w-4" />
      case "wishlist":
        return <Heart className="h-4 w-4" />
      case "review":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getRecommendedActions = (segment: Customer["segment"]) => {
    switch (segment) {
      case "new":
        return [
          { icon: <Gift className="h-4 w-4" />, label: "Send welcome discount" },
          { icon: <MessageSquare className="h-4 w-4" />, label: "Follow up on first purchase" },
          { icon: <Mail className="h-4 w-4" />, label: "Add to new customer email sequence" },
        ]
      case "returning":
        return [
          { icon: <Tag className="h-4 w-4" />, label: "Offer product recommendations" },
          { icon: <Mail className="h-4 w-4" />, label: "Send satisfaction survey" },
          { icon: <Gift className="h-4 w-4" />, label: "Provide loyalty program info" },
        ]
      case "loyal":
        return [
          { icon: <Gift className="h-4 w-4" />, label: "Send VIP exclusive offer" },
          { icon: <Tag className="h-4 w-4" />, label: "Offer early access to new products" },
          { icon: <MessageSquare className="h-4 w-4" />, label: "Request testimonial" },
        ]
      case "at-risk":
        return [
          { icon: <Gift className="h-4 w-4" />, label: "Send win-back discount" },
          { icon: <Mail className="h-4 w-4" />, label: "Send re-engagement email" },
          { icon: <MessageSquare className="h-4 w-4" />, label: "Request feedback" },
        ]
      case "lost":
        return [
          { icon: <Gift className="h-4 w-4" />, label: "Send major discount offer" },
          { icon: <Mail className="h-4 w-4" />, label: "Send product update newsletter" },
          { icon: <AlertCircle className="h-4 w-4" />, label: "Conduct exit survey" },
        ]
    }
  }

  const handleSaveNotes = () => {
    // In a real app, this would save to the database
    toast({
      title: "Notes saved",
      description: "Customer notes have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.avatar || undefined} />
            <AvatarFallback className="text-lg bg-neutral-900/10 dark:bg-neutral-50/10">
              {customer.name
                .split("")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              {getSegmentBadge(customer.segment)}
              <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400">Customer since {formatDate(customer.joinDate)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      <Separator />

      {/* Customer Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-neutral-500 mt-1 dark:text-neutral-400" />
                  <div>
                    <p>{customer.address}</p>
                    <p>
                      {customer.city}, {customer.state} {customer.zip}
                    </p>
                    <p>{customer.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                    <span>Total Spent</span>
                  </div>
                  <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                    <span>Total Orders</span>
                  </div>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                    <span>Last Order Date</span>
                  </div>
                  <span className="font-medium">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                    <span>Last Order Amount</span>
                  </div>
                  <span className="font-medium">
                    {customer.lastOrderAmount ? `$${customer.lastOrderAmount.toFixed(2)}` : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>The customer's most recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.slice(0, 3).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Based on customer segment: {customer.segment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getRecommendedActions(customer.segment)?.map((action, index) => (
                    <Button key={index} variant="outline" className="w-full justify-start" size="sm">
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Complete order history for this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer group">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{formatDateTime(order.date)}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent customer activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="h-full w-px bg-neutral-100 dark:bg-neutral-800" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Customer Notes</CardTitle>
              <CardDescription>Add private notes about this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this customer..."
                className="min-h-[200px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
            <div className="px-6 py-4 flex justify-end">
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing Heart component
function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
