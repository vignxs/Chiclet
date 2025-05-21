"use client"

import type React from "react"

import { useState } from "react"
import { useProductsStore, type Product, type ProductCategory, type ProductTag } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface ProductFormProps {
  editProduct?: Product
  onCancel: () => void
  onSave: () => void
}

export function ProductForm({ editProduct, onCancel, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: editProduct?.name || "",
    description: editProduct?.description || "",
    price: editProduct?.price.toString() || "",
    category: editProduct?.category || ("Hair" as ProductCategory),
    tag: editProduct?.tag || ("" as ProductTag),
    images: editProduct?.images || ["/placeholder.svg?height=600&width=600"],
    colors: editProduct?.colors || [""],
    stock: editProduct?.stock.toString() || "0",
  })

  const { addProduct, updateProduct } = useProductsStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = value
    setFormData((prev) => ({ ...prev, colors: newColors }))
  }

  const addColor = () => {
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, ""] }))
  }

  const removeColor = (index: number) => {
    const newColors = [...formData.colors]
    newColors.splice(index, 1)
    setFormData((prev) => ({ ...prev, colors: newColors }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast("Missing information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    // Validate price and stock
    const price = Number.parseFloat(formData.price)
    const stock = Number.parseInt(formData.stock)

    if (isNaN(price) || price <= 0) {
      toast("Invalid price", {
        description: "Please enter a valid price greater than 0.",
      })
      return
    }

    if (isNaN(stock) || stock < 0) {
      toast("Invalid stock", {
        description: "Please enter a valid stock value (0 or greater).",
      })
      return
    }

    // Filter out empty colors
    const colors = formData.colors.filter((color) => color.trim() !== "")

    if (colors.length === 0) {
      toast("Missing colors", {
        description: "Please add at least one color option.",
      })
      return
    }

    if (editProduct) {
      // Update existing product
      updateProduct(editProduct.id, {
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category as ProductCategory,
        tag: formData.tag as ProductTag,
        images: formData.images,
        colors,
        stock,
      })
      toast("Product updated", {
        description: "Your product has been successfully updated.",
      })
    } else {
      // Add new product
      addProduct({
        name: formData.name,
        description: formData.description,
        price,
        category: formData.category as ProductCategory,
        tag: formData.tag as ProductTag,
        images: formData.images,
        colors,
        stock,
      })
      toast("Product added", {
        description: "Your new product has been successfully added.",
      })
    }

    onSave()
  }

  const categories: ProductCategory[] = ["Hair", "Earrings", "Necklaces", "Bracelets", "Rings", "Anklets", "Other"]
  const tags: ProductTag[] = ["", "Bestseller", "New", "Limited", "Sale"]

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">{editProduct ? "Edit Product" : "Add New Product"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((category) => category.trim() !== "") // remove empty or whitespace-only strings
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Select value={formData.tag} onValueChange={(value) => handleSelectChange("tag", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter((tag) => tag.trim() !== "")
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}

                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Colors *</Label>
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      placeholder="Color name (e.g. Red, Blue, etc.)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColor(index)}
                      disabled={formData.colors.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addColor}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Color
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">
                  Currently using placeholder images. In a real implementation, this would be an image upload area.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">Image {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{editProduct ? "Update Product" : "Add Product"}</Button>
        </div>
      </form>
    </div>
  )
}
