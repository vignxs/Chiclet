"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShoppingBag, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AddressForm } from "@/components/address-form"
import { useAddressStore } from "@/lib/address-store"

interface CheckoutConfirmationProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedAddressId: number) => void
  total: number
  userId: string
}

export function CheckoutConfirmation({
  isOpen,
  onOpenChange,
  onConfirm,
  total,
  userId,
}: CheckoutConfirmationProps) {
  const allAddresses = useAddressStore((state) => state.addresses)

  const addresses = useMemo(
    () => allAddresses.filter((a) => a.user_id === userId),
    [allAddresses, userId]
  )

  const fetchAddresses = useAddressStore((state) => state.fetchAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleAddressFormSave = () => {
    setShowAddressForm(false)

    // Select the most recent address (first in list, since we prepend on insert)
    if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Confirm Your Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;re placing an order for ${total.toFixed(2)}. Select or add a delivery address to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Address List */}
        <div className="mt-4 space-y-4">
          {addresses.length > 0 ? (
            <RadioGroup
              value={selectedAddressId?.toString() || ""}
              onValueChange={(value) => setSelectedAddressId(parseInt(value))}
            >
              <div className="grid gap-3">
                {addresses.map((address) => (
                  <Label
                    key={address.id}
                    htmlFor={`address-${address.id}`}
                    className={`flex items-start space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${selectedAddressId === address.id
                      ? "border-black bg-muted"
                      : "hover:border-muted"
                      }`}
                  >
                    <RadioGroupItem
                      value={address.id.toString()}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
          )}

          {/* Toggle Add New Address */}
          {!showAddressForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          ) : (
            <div className="mt-2 border-t pt-4">
              <AddressForm
                userId={userId}
                onCancel={() => setShowAddressForm(false)}
                onSave={handleAddressFormSave}
              />
            </div>
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(selectedAddressId!)}
            disabled={selectedAddressId === null}
            className="bg-black hover:bg-gray-800"
          >
            Confirm Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
