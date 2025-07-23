/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { Package, ShoppingCart, CreditCard, Users, TrendingUp, TrendingDown } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useEnhancedDashboardStats, useBestSellingProducts } from "@/lib/queries"

export default function AdminDashboard() {
  const { data: stats, isLoading } = useEnhancedDashboardStats()
  const { data: bestSellingProducts, isLoading: isLoadingProducts } = useBestSellingProducts()

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      change: "+12%",
      positive: true,
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      change: "+5%",
      positive: true,
    },
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: CreditCard,
      change: "+18%",
      positive: true,
    },
    {
      title: "Active Carts",
      value: stats?.activeCartItems || 0,
      icon: Users,
      change: "-3%",
      positive: false,
    },
  ]

  const chartData = stats?.ordersChartData || []

  const bestSellingChartData =
    bestSellingProducts?.map((product) => {
      const typedProduct = product as { name: string; quantity: number; revenue: number }
      return {
        name: typedProduct.name.length > 15 ? typedProduct.name.substring(0, 15) + "..." : typedProduct.name,
        quantity: typedProduct.quantity,
        revenue: typedProduct.revenue,
      }
    }) || []

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-[#2568AC]/10 rounded-full">
                    <stat.icon className="w-6 h-6 text-[#2568AC]" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.positive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  orders: {
                    label: "Orders",
                    color: "#2568AC",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="orders" fill="#2568AC" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue (₹)",
                    color: "#2568AC",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2568AC"
                      strokeWidth={2}
                      dot={{ fill: "#2568AC" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Best Selling Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantity: {
                  label: "Quantity Sold",
                  color: "#2568AC",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bestSellingChartData} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" fill="#2568AC" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
