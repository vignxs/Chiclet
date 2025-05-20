"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully saved.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-medium mb-6">Store Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="Chiclet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Store Email</Label>
                  <Input id="store-email" type="email" defaultValue="hello@chiclet.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  rows={4}
                  defaultValue="Chiclet is a boutique shop offering trendy accessories for girls."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-currency">Currency</Label>
                  <Input id="store-currency" defaultValue="USD" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-medium mb-6">Shipping Options</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm text-gray-500">Offer free shipping on orders over a certain amount</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="free-shipping-threshold">Free Shipping Threshold ($)</Label>
                <Input id="free-shipping-threshold" type="number" defaultValue="50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping-fee">Standard Shipping Fee ($)</Label>
                <Input id="shipping-fee" type="number" defaultValue="5.99" />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-medium mb-6">Payment Methods</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Credit Card Payments</h3>
                  <p className="text-sm text-gray-500">Accept credit card payments through Stripe</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-gray-500">Accept payments through PayPal</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Apple Pay</h3>
                  <p className="text-sm text-gray-500">Accept Apple Pay payments</p>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-medium mb-6">Email Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Order Confirmations</h3>
                  <p className="text-sm text-gray-500">Send email confirmations when orders are placed</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Shipping Updates</h3>
                  <p className="text-sm text-gray-500">Send emails when order status changes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-500">Receive notifications when product stock is low</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
