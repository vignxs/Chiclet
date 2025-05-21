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
import { ShoppingBag } from "lucide-react"

interface CheckoutConfirmationProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  total: number
}

export function CheckoutConfirmation({ isOpen, onOpenChange, onConfirm, total }: CheckoutConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Confirm Your Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;re about to place an order for ${total.toFixed(2)}. Would you like to proceed with this purchase?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-black hover:bg-gray-800">
            Confirm Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
