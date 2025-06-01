"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import { useProductStore } from "@/lib/productStore"

const categories = ["All", "Earrings", "Necklaces", "Bracelets", "Hair", "Rings", "Anklets"]

export default function ShopPage() {
  const { products: allProducts } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Get category from URL parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    if (category && categories.includes(category)) {
      setSelectedCategory(category)
    }
  }, [])

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Update URL with selected category
    const url = new URL(window.location.href)
    if (category === "All") {
      url.searchParams.delete("category")
    } else {
      url.searchParams.set("category", category)
    }
    window.history.pushState({}, '', url.toString())
  }

  // Apply filters
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory === "All" || selectedCategory === product.category

    // Price filter
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        return a.tag === "Bestseller" ? -1 : b.tag === "Bestseller" ? 1 : 0
      default: // newest
        return a.tag === "New" ? -1 : b.tag === "New" ? 1 : 0
    }
  })

  const applyFilters = () => {
    // Filters are already applied reactively
    setShowFilters(false)
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Page Header */}
      <section className="w-full py-12 md:py-16 bg-gray-50 animate-fadeIn">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Shop All Accessories</h1>
            <p className="text-gray-500 md:text-lg max-w-[700px]">
              Browse our collection of trendy accessories for every occasion
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="w-full py-8 md:py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Sidebar */}
            <div className={`w-full md:w-64 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
              <div className="md:sticky md:top-24 space-y-6 animate-slideIn">
                <div className="flex items-center justify-between md:hidden">
                  <h2 className="font-medium">Filters</h2>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                    Close
                  </Button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Search</h3>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="flex-1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <Slider
                    defaultValue={[0, 50]}
                    max={50}
                    step={1}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="font-medium">Products ({sortedProducts.length})</h2>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products match your filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSearchTerm("")
                      setSelectedCategory("All")
                      setPriceRange([0, 50])
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                  {sortedProducts.map((product) => (
                    <Link
                      href={`/shop/${product.id}`}
                      key={product.id}
                      className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md animate-fadeIn hover-lift dark:border-neutral-800"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100 image-hover">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {product.tag && (
                        <div className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded">
                          {product.tag}
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="font-medium text-lg">{product.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-500">₹{product.price}</p>
                          <span className="text-xs text-gray-400">{product.category}</span>
                        </div>
                        <Button className="w-full mt-3 bg-black text-white hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Product
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-black text-white hover:bg-gray-800">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
