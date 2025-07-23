"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, CheckCircle, Clock, XCircle } from "lucide-react"
import { usePayments } from "@/lib/queries"
import { format } from "date-fns"

const paymentStatusIcons = {
  captured: CheckCircle,
  pending: Clock,
  failed: XCircle,
  refunded: XCircle,
}

const paymentStatusColors = {
  captured: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
}

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments()

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

  const totalAmount = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0
  const successfulPayments = payments?.filter((p) => p.payment_status === "captured").length || 0

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-[#2568AC]/10 rounded-full">
                  <CreditCard className="w-6 h-6 text-[#2568AC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{successfulPayments}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{payments?.length || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment) => {
                  const StatusIcon =
                    paymentStatusIcons[payment.payment_status as keyof typeof paymentStatusIcons] || Clock
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.razorpay_payment_id}</TableCell>
                      <TableCell className="font-semibold">₹{Number(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>{payment.currency}</TableCell>
                      <TableCell>
                        <Badge
                          className={paymentStatusColors[payment.payment_status as keyof typeof paymentStatusColors]}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {payment.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paid_at ? format(new Date(payment.paid_at), "MMM dd, yyyy HH:mm") : "N/A"}
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
