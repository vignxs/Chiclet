// components/AdminSidebar.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Package, ShoppingBag, Users, Settings } from "lucide-react"
import { useAuthStore } from "@/lib/auth"

export default function AdminSidebar() {
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="text-xl font-bold">
          Chiclet Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-800">
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link href="/admin/products" className="flex items-center p-2 rounded-md hover:bg-gray-800">
          <Package className="h-5 w-5 mr-3" />
          Products
        </Link>
        <Link href="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-gray-800">
          <ShoppingBag className="h-5 w-5 mr-3" />
          Orders
        </Link>
        <Link href="/admin/customers" className="flex items-center p-2 rounded-md hover:bg-gray-800">
          <Users className="h-5 w-5 mr-3" />
          Customers
        </Link>
        <Link href="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-gray-800">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Button variant="ghost" className="w-full justify-start text-white" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
