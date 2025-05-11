"use client"

import { useState, useEffect } from "react"
import { useOrdersStore } from "@/lib/orders"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Mail, Phone } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  orders: number
  totalSpent: number
  lastOrder: string
}

export default function CustomersPage() {
  const { orders } = useOrdersStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Group orders by customer
    const customerMap = new Map<string, Customer>()

    orders.forEach((order) => {
      const customerId = order.user_id
      const customerName = "order.shippingAddress.name"

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: customerName,
          email: `${customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Mock email
          orders: 0,
          totalSpent: 0,
          lastOrder: "",
        })
      }

      const customer = customerMap.get(customerId)!
      customer.orders += 1
      customer.totalSpent += order.total

      // Update last order date if this order is more recent
      const orderDate = new Date(order.created_at).getTime()
      const lastOrderDate = customer.lastOrder ? new Date(customer.lastOrder).getTime() : 0
      if (orderDate > lastOrderDate) {
        customer.lastOrder = order.created_at
      }
    })

    setCustomers(Array.from(customerMap.values()))
  }, [orders])

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort customers by total spent (highest first)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-gray-500 mt-1">View and manage your customers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search customers..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {sortedCustomers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
