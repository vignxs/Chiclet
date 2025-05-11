"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"
import { useOrdersStore } from "@/lib/orders"
import { useAddressStore } from "@/lib/address-store"
import { CheckoutConfirmation } from "@/components/checkout-confirmation"
import { AddressSelector } from "@/components/address-selector"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { addOrder } = useOrdersStore()
  const { getAddressesByUserId } = useAddressStore()
  const router = useRouter()

  const [isCheckoutConfirmOpen, setIsCheckoutConfirmOpen] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false)

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: number) => {
    removeItem(id)
    toast("Item removed", {
      description: "The item has been removed from your cart.",
    })
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast("Please sign in", {
        description: "You need to be signed in to checkout.",
      })
      router.push("/signin?redirect=/cart")
      return
    }

    // Check if user has addresses
    const addresses = getAddressesByUserId(user?.id || "")
    if (addresses.length === 0) {
      setIsAddressSheetOpen(true)
      return
    }

    // If user has addresses but none selected, select the first one
    if (selectedAddressId === null && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id)
    }

    setIsCheckoutConfirmOpen(true)
  }

  const handleConfirmOrder = async () => {
    if (!isAuthenticated || !user || selectedAddressId === null) {
      toast("Cannot complete checkout", {
        description: "Please sign in and select a shipping address.",
      })
      return
    }

    const addresses = getAddressesByUserId(user.id)
    const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

    if (!selectedAddress) {
      toast("Address not found", {
        description: "Please select a valid shipping address.",
      })
      return
    }

    // Create order
    const order = await addOrder(
      user.id,
      items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "/placeholder.svg",
      })),
      selectedAddressId
    )

    if (!order) {
      toast("Failed to place order", {
        description: "Something went wrong. Please try again.",
      })
      return
    }

    // Clear cart
    clearCart()

    // Show success message
    toast("Order placed successfully!", {
      description: `Your order #${order.id} has been placed.`,
    })

    // Redirect to order confirmation
    router.push(`/orders/${order.id}`)
  }

  const handleClearCart = () => {
    clearCart()
    toast("Cart cleared", {
      description: "All items have been removed from your cart.",
    })
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col">
        <section className="w-full py-12 md:py-24 flex flex-col items-center justify-center animate-fadeIn">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-300" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Browse our collection to find something you&apos;ll
              love!
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-8 md:py-12 animate-fadeIn">
        <div className="container px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              {items.map((item) => (
                <div key={item.id} className="grid md:grid-cols-12 gap-4 py-4 border-b items-center animate-slideIn">
                  {/* Product */}
                  <div className="md:col-span-6 flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden border bg-gray-100">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <Link href={`/shop/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {item.color && <div className="text-sm text-gray-500">Color: {item.color}</div>}
                      <button
                        className="text-sm text-red-500 hover:text-red-700 flex items-center mt-1 md:hidden"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <div className="md:hidden text-sm text-gray-500">Price:</div>${item.price.toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="md:hidden text-sm text-gray-500 mr-2">Quantity:</div>
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 text-right flex items-center justify-between md:justify-end">
                    <div className="md:hidden text-sm text-gray-500">Total:</div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      className="text-gray-400 hover:text-red-500 ml-4 hidden md:block"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="flex justify-between items-center pt-4">
                <Link href="/shop">
                  <Button variant="outline" className="border-black hover:bg-gray-100">
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 space-y-6 bg-gray-50 sticky top-24">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Sheet open={isAddressSheetOpen} onOpenChange={setIsAddressSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        className="w-full bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105"
                        onClick={handleCheckout}
                      >
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Shipping Address</SheetTitle>
                        <SheetDescription>Select or add a shipping address for your order.</SheetDescription>
                      </SheetHeader>
                      <div className="py-6">
                        <AddressSelector
                          userId={user?.id || ""}
                          selectedAddressId={selectedAddressId}
                          onSelectAddress={(addressId) => {
                            setSelectedAddressId(addressId)
                            // If user has selected an address, close the sheet and open checkout confirmation
                            if (isAuthenticated && user) {
                              setIsAddressSheetOpen(false)
                              setIsCheckoutConfirmOpen(true)
                            }
                          }}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="text-xs text-gray-500 text-center">Secure checkout powered by Stripe</div>
                </div>

                {/* Promo Code */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Promo Code</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter code" className="flex-1" />
                    <Button variant="outline" className="border-black hover:bg-gray-100">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Confirmation Dialog */}
      <CheckoutConfirmation
        isOpen={isCheckoutConfirmOpen}
        onOpenChange={setIsCheckoutConfirmOpen}
        onConfirm={handleConfirmOrder}
        total={total}
      />
    </main>
  )
}
