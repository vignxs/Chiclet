"use client"

import type React from "react"

import { useState } from "react"
import { useAddressStore, type Address } from "@/lib/address-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { toast } from "sonner"

interface AddressFormProps {
  userId: string
  editAddress?: Address
  onCancel: () => void
  onSave: () => void
}

export function AddressForm({ userId, editAddress, onCancel, onSave }: AddressFormProps) {
  const [formData, setFormData] = useState({
    name: editAddress?.name || "",
    street: editAddress?.street || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    zip: editAddress?.zip || "",
    country: editAddress?.country || "",
  })

  const { addAddress, updateAddress } = useAddressStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.zip || !formData.country) {
      toast( "Missing information",{
        description: "Please fill in all fields.",
      })
      return
    }

    if (editAddress) {
      // Update existing address
      updateAddress(editAddress.id, formData)
      toast("Address updated",{
        description: "Your address has been successfully updated.",
      })
    } else {
      // Add new address
      addAddress(userId, formData)
      toast("Address added",{
        description: "Your new address has been successfully added.",
      })
    }

    onSave()
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{editAddress ? "Edit Address" : "Add New Address"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Address Name</Label>
          <Input id="name" name="name" placeholder="Home, Work, etc." value={formData.name} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input id="street" name="street" placeholder="123 Main St" value={formData.street} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input id="zip" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{editAddress ? "Update Address" : "Add Address"}</Button>
        </div>
      </form>
    </div>
  )
}
