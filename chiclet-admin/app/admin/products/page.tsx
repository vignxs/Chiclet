"use client"

import { useState } from "react"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/admin/product-form"
import { ProductList } from "@/components/admin/product-list"
import { Plus } from "lucide-react"

export default function ProductsPage() {
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)

  const handleAddProduct = () => {
    setEditingProduct(undefined)
    setShowProductForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleFormCancel = () => {
    setShowProductForm(false)
    setEditingProduct(undefined)
  }

  const handleFormSave = () => {
    setShowProductForm(false)
    setEditingProduct(undefined)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        {!showProductForm && (
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {showProductForm ? (
        <ProductForm editProduct={editingProduct} onCancel={handleFormCancel} onSave={handleFormSave} />
      ) : (
        <ProductList onEdit={handleEditProduct} />
      )}
    </div>
  )
}
