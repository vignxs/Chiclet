"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ImageIcon, X, Plus, Trash2 } from "lucide-react"
import type { Product, ProductColor } from "@/lib/products-store"

interface ProductFormProps {
  product: Product | null
  onSave: (product: Product, colors: string[], isNew: boolean) => void
  onCancel: () => void
}

// Available categories
const categories = ["Hair", "Earrings", "Necklaces", "Bracelets", "Anklets", "Rings"]

// Available tags
const tags = ["Bestseller", "New", "Limited", "Sale"]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const isNew = !product

  const [formData, setFormData] = useState<Omit<Product, "id" | "colors">>({
    name: product?.name || "",
    price: product?.price || 0,
    tag: product?.tag || null,
    category: product?.category || null,
    description: product?.description || "",
    rating: product?.rating || null,
    image: product?.image || null,
  })

  const [colors, setColors] = useState<string[]>(product?.colors?.map((c: ProductColor) => c.color) || [""])

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        handleChange("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    handleChange("image", null)
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const addColor = () => {
    setColors([...colors, ""])
  }

  const removeColor = (index: number) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    setColors(newColors)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    // Validate colors
    if (colors.length === 0 || colors.every((c) => !c.trim())) {
      newErrors.colors = "At least one color is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Filter out empty colors
    const validColors = colors.filter((c) => c.trim() !== "")

    onSave(
      {
        id: product?.id || 0,
        ...formData,
      },
      validColors,
      isNew,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
                required
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ""}
                onChange={(e) => handleChange("rating", e.target.value ? Number.parseFloat(e.target.value) : null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => handleChange("category", value || null)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Select value={formData.tag || ""} onValueChange={(value) => handleChange("tag", value || null)}>
                <SelectTrigger id="tag">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>
                Product Colors <span className="text-red-500">*</span>
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={addColor}>
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    placeholder="Enter color (e.g., Red, Blue, Silver)"
                    className={errors.colors ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(index)}
                    disabled={colors.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {errors.colors && <p className="text-xs text-red-500">{errors.colors}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border rounded-md p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-full h-48 object-contain rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-neutral-100 rounded-md dark:bg-neutral-800">
                  <ImageIcon className="h-10 w-10 text-neutral-500 mb-2 dark:text-neutral-400" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No image selected</p>
                </div>
              )}

              <div className="mt-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product ID</Label>
            <Input value={isNew ? "Will be generated" : product?.id} disabled />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isNew ? "Create Product" : "Update Product"}</Button>
      </div>
    </form>
  )
}
