"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { useAddressStore, type Address } from "@/lib/address-store"
import { AddressCard } from "@/components/address-card"
import { AddressForm } from "@/components/address-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Package, Plus, Settings, User } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { getAddressesByUserId } = useAddressStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && !isLoading) {
      router.push("/signin")
    }

    // Get addresses for the current user
    if (user) {
      const userAddresses = getAddressesByUserId(user.id)
      setAddresses(userAddresses)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user, isAuthenticated, getAddressesByUserId, router, isLoading])

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setShowAddressForm(true)
  }

  const handleAddressFormCancel = () => {
    setShowAddressForm(false)
    setEditingAddress(undefined)
  }

  const handleAddressFormSave = () => {
    setShowAddressForm(false)
    setEditingAddress(undefined)
    // Refresh addresses
    if (user) {
      const userAddresses = getAddressesByUserId(user.id)
      setAddresses(userAddresses)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm dark:border-neutral-800">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url || "/placeholder.svg"}
                        alt={user.user_metadata.full_name || "User"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || "User"}</h2>
                  <p className="text-gray-500 mt-1">{user?.email}</p>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <nav className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 rounded-md bg-gray-100 font-medium text-gray-900"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="addresses" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="account">Account Details</TabsTrigger>
              </TabsList>

              <TabsContent value="addresses" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Addresses</h2>
                  {!showAddressForm && (
                    <Button onClick={() => setShowAddressForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  )}
                </div>

                {showAddressForm ? (
                  <AddressForm
                    userId={user?.id || ""}
                    editAddress={editingAddress}
                    onCancel={handleAddressFormCancel}
                    onSave={handleAddressFormSave}
                  />
                ) : addresses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard key={address.id} address={address} onEdit={handleEditAddress} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                    <Button onClick={() => setShowAddressForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <h2 className="text-xl font-semibold">Account Details</h2>
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm dark:border-neutral-800">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p>{user?.user_metadata?.full_name || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p>{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                        <p>{new Date(user?.created_at || "").toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <Button variant="outline" asChild>
                        <Link href="/settings">Edit Account Settings</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
