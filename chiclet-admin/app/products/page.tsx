"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"
import { useProfilesStore } from "@/lib/profiles-store"
import { Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Star,
  ImageIcon,
  Copy,
  ArrowUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductForm } from "@/components/product-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { type Product, useProductsStore } from "@/lib/products-store"

// Available categories for filtering
const categories = ["All", "Hair", "Earrings", "Necklaces", "Bracelets", "Anklets", "Rings"]

// Available tags for filtering
const tags = ["All", "Bestseller", "New", "Limited", "Sale"]

export default function ProductsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { isAdmin } = useProfilesStore()
  const {
    products,
    isLoading: isLoadingProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductsStore()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [tagFilter, setTagFilter] = useState("All")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [sortField, setSortField] = useState<keyof Product>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Product form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Delete confirmation dialog
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Bulk delete confirmation dialog
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        router.push("/signin?redirect=/products")
        return
      }

      // Check if user is admin
      if (user) {
        const adminStatus = await isAdmin(user.id)
        setIsAuthorized(adminStatus)

        if (!adminStatus) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          })
          router.push("/")
        }
      }

      setIsAuthChecking(false)
    }

    checkAuth()
  }, [user, isAuthenticated, isAdmin, router, toast])

  // Fetch products on mount
  useEffect(() => {
    if (isAuthorized) {
      fetchProducts()
    }
  }, [isAuthorized, fetchProducts])

  // If still checking auth or loading products, show loading state
  if (isAuthChecking || (isAuthorized && isLoadingProducts)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Will redirect in useEffect
  }

  // Filter products based on search term, category, and tag
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || product.category === categoryFilter) &&
      (tagFilter === "All" || product.tag === tagFilter),
  )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    // Handle null values
    if (aValue === null && bValue === null) return 0
    if (aValue === null) return 1
    if (bValue === null) return -1

    // Sort strings
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    // Sort numbers
    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map((product) => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete.id)
      if (success) {
        toast({
          title: "Product deleted",
          description: `${productToDelete.name} has been deleted.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        })
      }
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to delete.",
        variant: "destructive",
      })
      return
    }
    setIsBulkDeleteDialogOpen(true)
  }

  const confirmBulkDelete = async () => {
    let successCount = 0
    let failCount = 0

    for (const id of selectedProducts) {
      const success = await deleteProduct(id)
      if (success) {
        successCount++
      } else {
        failCount++
      }
    }

    if (successCount > 0) {
      toast({
        title: "Products deleted",
        description: `${successCount} products have been deleted.`,
      })
    }

    if (failCount > 0) {
      toast({
        title: "Some deletions failed",
        description: `${failCount} products could not be deleted.`,
        variant: "destructive",
      })
    }

    setSelectedProducts([])
    setIsBulkDeleteDialogOpen(false)
  }

  const handleDuplicateProduct = async (product: Product) => {
    // Create a new product based on the existing one
    const { id, ...productWithoutId } = product
    const newProduct = {
      ...productWithoutId,
      name: `${product.name} (Copy)`,
    }

    // Get colors from the original product
    const colors = product.colors?.map((c) => c.color) || []

    const result = await addProduct(newProduct, colors)
    if (result) {
      toast({
        title: "Product duplicated",
        description: `${product.name} has been duplicated.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to duplicate product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProduct = async (product: Product, colors: string[], isNew: boolean) => {
    if (isNew) {
      // Add new product
      const { id, ...productWithoutId } = product
      const result = await addProduct(productWithoutId, colors)
      if (result) {
        toast({
          title: "Product added",
          description: `${product.name} has been added.`,
        })
        setIsFormOpen(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to add product. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // Update existing product
      const { id, ...updates } = product
      const success = await updateProduct(id, updates, colors)
      if (success) {
        toast({
          title: "Product updated",
          description: `${product.name} has been updated.`,
        })
        setIsFormOpen(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
          variant: "destructive",
        })
      }
    }
    setEditingProduct(null)
  }

  const handleRefresh = async () => {
    await fetchProducts()
    toast({
      title: "Products refreshed",
      description: "Product list has been refreshed.",
    })
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    const csv = [
      // Header row
      ["ID", "Name", "Category", "Price", "Tag", "Rating", "Colors"].join(","),
      // Data rows
      ...products.map((product) =>
        [
          product.id,
          `"${product.name.replace(/"/g, "''")}"`, // Escape quotes in CSV
          `"${product.category || ""}"`,
          product.price,
          `"${product.tag || ""}"`,
          product.rating || "",
          `"${product.colors?.map((c) => c.color).join(",") || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `products-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export complete",
      description: "Your product data has been exported to CSV.",
    })
  }

  const renderRatingStars = (rating: number | null) => {
    if (rating === null) return "No rating"

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage your product inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoadingProducts}>
              {isLoadingProducts ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{selectedProducts.length} selected</span>
              <Button variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        {sortedProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-neutral-100 p-3 mb-3 dark:bg-neutral-800">
                <ImageIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No products found</h3>
              <p className="text-sm text-neutral-500 mb-4 dark:text-neutral-400">
                {searchTerm || categoryFilter !== "All" || tagFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "Add your first product to get started"}
              </p>
              {searchTerm || categoryFilter !== "All" || tagFilter !== "All" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("All")
                    setTagFilter("All")
                  }}
                >
                  Reset Filters
                </Button>
              ) : (
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Colors</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("rating")}>
                      Rating
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded-md"
                          />
                        )}
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>{product.category || "—"}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.colors?.map((color, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {color.color}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.tag ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {product.tag}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{renderRatingStars(product.rating)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the details of your existing product."
                : "Fill in the details to add a new product your inventory."}
            </DialogDescription>
          </DialogHeader>
          <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedProducts.length} selected products. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
