"use client"

import { useState } from "react"
import { useAddressStore } from "@/lib/address-store"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AddressForm } from "@/components/address-form"
import { Plus } from "lucide-react"

interface AddressSelectorProps {
  userId: string
  selectedAddressId: number | null
  onSelectAddress: (addressId: number) => void
}

export function AddressSelector({ userId, selectedAddressId, onSelectAddress }: AddressSelectorProps) {
  const { getAddressesByUserId } = useAddressStore()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const addresses = getAddressesByUserId(userId)

  const handleAddressFormCancel = () => {
    setShowAddressForm(false)
  }

  const handleAddressFormSave = () => {
    setShowAddressForm(false)
    // If no address was previously selected, select the most recently added one
    if (selectedAddressId === null && addresses.length > 0) {
      const latestAddress = addresses[addresses.length - 1]
      onSelectAddress(latestAddress.id)
    }
  }

  if (showAddressForm) {
    return <AddressForm userId={userId} onCancel={handleAddressFormCancel} onSave={handleAddressFormSave} />
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 mb-4">You don&apos;t have any saved addresses yet.</p>
        <Button onClick={() => setShowAddressForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Address
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedAddressId?.toString() || ""}
        onValueChange={(value) => onSelectAddress(Number.parseInt(value))}
      >
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start space-x-2">
              <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`address-${address.id}`} className="font-medium cursor-pointer flex flex-col">
                  <span>{address.name}</span>
                  <span className="font-normal text-sm text-gray-500">{address.street}</span>
                  <span className="font-normal text-sm text-gray-500">
                    {address.city}, {address.state} {address.zip}
                  </span>
                  <span className="font-normal text-sm text-gray-500">{address.country}</span>
                </Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>
    </div>
  )
}
