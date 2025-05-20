"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useProductsStore } from "@/lib/products"
import { useOrdersStore } from "@/lib/orders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, DollarSign, Users } from "lucide-react"

export default function AdminDashboard() {
  const { products } = useProductsStore()
  const { orders } = useOrdersStore()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  })

  useEffect(() => {
    // Calculate dashboard statistics
    const totalProducts = products.length
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const lowStockProducts = products.filter((product) => product.stock < 10).length

    setStats({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
    })
  }, [products, orders])

  // Get recent orders
  const recentOrders = [...orders]
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 5)

  // Get low stock products
  const lowStockProducts = products
    .filter((product) => product.stock < 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your admin dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.lowStockProducts} products with low stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">
              {orders.filter((order) => order.status === "processing").length} orders processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">
              $
              {orders
                .filter((order) => {
                  const date = new Date(order.createdAt)
                  const now = new Date()
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                })
                .reduce((sum, order) => sum + order.total, 0)
                .toFixed(2)}{""}
              this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(orders.map((order) => order.userId)).size}</div>
            <p className="text-xs text-gray-500 mt-1">
              {
                orders.filter((order) => {
                  const date = new Date(order.createdAt)
                  const now = new Date()
                  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
                  return date > thirtyDaysAgo
                }).length
              }{""}
              orders in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders placed on your store</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                          order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No orders yet</div>
            )}
            <div className="mt-4">
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View all orders
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products with stock less than 10 units</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 5
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.stock} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No low stock products</div>
            )}
            <div className="mt-4">
              <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Manage products
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
