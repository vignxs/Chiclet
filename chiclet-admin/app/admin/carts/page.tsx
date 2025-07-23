"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Users, Package } from "lucide-react"
import { useCartItems } from "@/lib/queries"
import Image from "next/image"

export default function CartItemsPage() {
  const { data: cartItems, isLoading } = useCartItems()

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

  const totalCartValue = cartItems?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) || 0
  const uniqueUsers = new Set(cartItems?.map((item) => item.user_id)).size
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cart Items</h1>
          <p className="text-gray-600">Monitor active shopping carts and abandoned items</p>
        </div>

        {/* Cart Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cart Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalCartValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#2568AC]/10 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-[#2568AC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.image || "/placeholder.svg?height=50&width=50&query=product"}
                        alt={item.name || "Product"}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.user_id.slice(0, 8)}...
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.quantity}</Badge>
                    </TableCell>
                    <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">₹{(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
