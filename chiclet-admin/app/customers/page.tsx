"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { useAdminStore } from "@/lib/admin"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Mail,
  Phone,
  Download,
  RefreshCw,
  Users,
  UserPlus,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Heart,
  ChevronRight,
  ArrowUpDown,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CustomerDetails } from "@/components/customer-details"

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

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    totalSpent: 429.97,
    totalOrders: 5,
    lastOrderDate: "2023-05-15T10:30:00Z",
    lastOrderAmount: 129.99,
    status: "active",
    segment: "loyal",
    joinDate: "2022-01-15T10:30:00Z",
    avatar: null,
    notes: "Prefers email communication. Interested in hair accessories.",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "USA",
    totalSpent: 79.95,
    totalOrders: 1,
    lastOrderDate: "2023-05-14T14:45:00Z",
    lastOrderAmount: 79.95,
    status: "active",
    segment: "new",
    joinDate: "2023-05-14T14:45:00Z",
    avatar: null,
    notes: null,
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 234-5678",
    address: "789 Pine St",
    city: "Chicago",
    state: "IL",
    zip: "60007",
    country: "USA",
    totalSpent: 349.5,
    totalOrders: 3,
    lastOrderDate: "2023-05-14T09:15:00Z",
    lastOrderAmount: 149.5,
    status: "active",
    segment: "returning",
    joinDate: "2022-08-10T15:20:00Z",
    avatar: null,
    notes: "Prefers phone calls. Birthday in June.",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob@example.com",
    phone: "+1 (555) 876-5432",
    address: "321 Elm St",
    city: "Miami",
    state: "FL",
    zip: "33101",
    country: "USA",
    totalSpent: 59.99,
    totalOrders: 1,
    lastOrderDate: "2023-05-13T16:20:00Z",
    lastOrderAmount: 59.99,
    status: "inactive",
    segment: "at-risk",
    joinDate: "2022-11-05T09:45:00Z",
    avatar: null,
    notes: "Has not responded to recent emails.",
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 (555) 345-6789",
    address: "654 Maple Ave",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    country: "USA",
    totalSpent: 0,
    totalOrders: 0,
    lastOrderDate: "",
    lastOrderAmount: 0,
    status: "inactive",
    segment: "lost",
    joinDate: "2022-06-20T11:10:00Z",
    avatar: null,
    notes: "Created account but never placed an order.",
  },
  {
    id: 6,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    address: "987 Cedar Rd",
    city: "Boston",
    state: "MA",
    zip: "02108",
    country: "USA",
    totalSpent: 1245.75,
    totalOrders: 12,
    lastOrderDate: "2023-05-16T13:25:00Z",
    lastOrderAmount: 89.99,
    status: "active",
    segment: "loyal",
    joinDate: "2021-09-12T08:30:00Z",
    avatar: null,
    notes: "VIP customer. Prefers premium products.",
  },
]

// Segments for filtering
const segments = ["All", "new", "returning", "loyal", "at-risk", "lost"]

// Statuses for filtering
const statuses = ["All", "active", "inactive"]

export default function CustomersPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortField, setSortField] = useState<keyof Customer>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("all")

  // Customer details dialog
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Authentication check
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
      router.push("/signin?redirect=/customers")
      return
    }

    if (user) {
      const authorized = isAdmin(user.id)
      setIsAuthorized(authorized)

      if (!authorized) {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    setIsLoading(false)
  }, [user, isAuthenticated, isAdmin, router, toast])

  // If still loading or not authorized, show loading state or nothing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect in useEffect
  }

  // Filter customers based on search term, segment, and status
  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)) &&
      (segmentFilter === "All" || customer.segment === segmentFilter) &&
      (statusFilter === "All" || customer.status === statusFilter),
  )

  // Apply tab filtering
  const tabFilteredCustomers =
    activeTab === "all"
      ? filteredCustomers
      : activeTab === "active"
        ? filteredCustomers.filter((c) => c.status === "active")
        : activeTab === "inactive"
          ? filteredCustomers.filter((c) => c.status === "inactive")
          : activeTab === "new"
            ? filteredCustomers.filter((c) => c.segment === "new")
            : activeTab === "loyal"
              ? filteredCustomers.filter((c) => c.segment === "loyal")
              : filteredCustomers

  // Sort customers
  const sortedCustomers = [...tabFilteredCustomers].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    // Handle empty string values
    if (aValue === "" && bValue === "") return 0
    if (aValue === "") return 1
    if (bValue === "") return -1

    // Sort strings
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // Sort numbers
    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  // Calculate customer metrics
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage and analyze your customer base</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <div className="flex items-center pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="text-green-500 flex items-center mr-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {Math.round((activeCustomers / totalCustomers) * 100)}%
                </span>
                <span>active customers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Heart className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <div className="flex items-center pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span>Last 30 days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <div className="flex items-center pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span>From all customers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <ShoppingBag className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
              <div className="flex items-center pt-1 text-xs text-neutral-500 dark:text-neutral-400">
                <span>Per order</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Segments Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Distribution of customers by segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["loyal", "returning", "new", "at-risk", "lost"].map((segment) => {
                  const count = customers.filter((c) => c.segment === segment).length
                  const percentage = Math.round((count / totalCustomers) * 100)

                  return (
                    <div key={segment} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{segment}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className={
                          segment === "loyal"
                            ? "bg-purple-100"
                            : segment === "returning"
                              ? "bg-green-100"
                              : segment === "new"
                                ? "bg-blue-100"
                                : segment === "at-risk"
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                        }
                        indicatorClassName={
                          segment === "loyal"
                            ? "bg-purple-500"
                            : segment === "returning"
                              ? "bg-green-500"
                              : segment === "new"
                                ? "bg-blue-500"
                                : segment === "at-risk"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Key metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 p-2 bg-blue-100 rounded-full">
                    <LineChart className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Customer Growth</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Last 30 days</div>
                  </div>
                </div>
                <div className="text-green-500 font-medium">+12%</div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 p-2 bg-purple-100 rounded-full">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Repeat Purchase Rate</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Last 90 days</div>
                  </div>
                </div>
                <div className="font-medium">28%</div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 p-2 bg-pink-100 rounded-full">
                    <PieChart className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Customer Retention</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Last 12 months</div>
                  </div>
                </div>
                <div className="font-medium">65%</div>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                View Full Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Manage and view your customer database</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment} value={segment}>
                        {segment === "All" ? "All Segments" : segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="loyal">Loyal</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Customer Table */}
            {sortedCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-neutral-100 p-3 mb-3 dark:bg-neutral-800">
                  <Users className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No customers found</h3>
                <p className="text-sm text-neutral-500 mb-4 dark:text-neutral-400">
                  {searchTerm || segmentFilter !== "All" || statusFilter !== "All"
                    ? "Try adjusting your search or filters"
                    : "Add your first customer to get started"}
                </p>
                {(searchTerm || segmentFilter !== "All" || statusFilter !== "All") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSegmentFilter("All")
                      setStatusFilter("All")
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                          Customer
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort("segment")}>
                          Segment
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort("totalSpent")}>
                          Total Spent
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort("lastOrderDate")}>
                          Last Order
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar || undefined} />
                              <AvatarFallback className="bg-neutral-900/10 dark:bg-neutral-50/10">
                                {customer.name
                                  .split("")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Joined {formatDate(customer.joinDate)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-neutral-500 dark:text-neutral-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1 text-neutral-500 dark:text-neutral-400" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getSegmentBadge(customer.segment)}</TableCell>
                        <TableCell>
                          <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.lastOrderDate ? (
                            <div>
                              <div>{formatDate(customer.lastOrderDate)}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                ${customer.lastOrderAmount.toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-neutral-500 text-sm dark:text-neutral-400">No orders yet</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewCustomer(customer)
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing {sortedCustomers.length} of {customers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
