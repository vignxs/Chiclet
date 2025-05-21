"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { useAdminStore } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Loader2, LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated && !isLoading) {
      router.push("/signin?redirect=/admin")
      return
    }

    if (user) {
      const authorized = isAdmin(user.id)
      setIsAuthorized(authorized)

      if (!authorized && !isLoading) {
        router.push("/")
      }
    }

    setIsLoading(false)
  }, [user, isAuthenticated, isAdmin, router, isLoading])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold">
            Chiclet Admin
          </Link>
        </div>

        {/* Update the navigation links to include our new pages */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-800">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/products" className="flex items-center p-2 rounded-md hover:bg-gray-800">
            <Package className="h-5 w-5 mr-3" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-gray-800">
            <ShoppingBag className="h-5 w-5 mr-3" />
            Orders
          </Link>
          <Link href="/customers" className="flex items-center p-2 rounded-md hover:bg-gray-800">
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
