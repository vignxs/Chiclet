"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Share2, ShoppingBag, Star, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCartStore } from "@/lib/store"

// Sample product data
const products = [
  {
    id: 1,
    name: "Crystal Hair Clips",
    price: 12.99,
    tag: "Bestseller",
    category: "Hair",
    description:
      "Elegant crystal hair clips that add a touch of sparkle to any hairstyle. Perfect for special occasions or everyday glamour.",
    colors: ["Silver", "Gold", "Rose Gold"],
    rating: 4.8,
  },
  {
    id: 2,
    name: "Pearl Earrings",
    price: 18.99,
    tag: "New",
    category: "Earrings",
    description:
      "Classic pearl earrings with a modern twist. These versatile studs complement both casual and formal outfits.",
    colors: ["White", "Cream", "Black"],
    rating: 4.5,
  },
  {
    id: 3,
    name: "Butterfly Necklace",
    price: 24.99,
    tag: "Limited",
    category: "Necklaces",
    description: "Delicate butterfly pendant on a fine chain. This necklace symbolizes transformation and beauty.",
    colors: ["Silver", "Gold"],
    rating: 4.9,
  },
  {
    id: 4,
    name: "Scrunchie Set",
    price: 9.99,
    tag: "",
    category: "Hair",
    description:
      "Set of 5 premium scrunchies in various colors and patterns. Gentle on hair while adding a stylish touch to your ponytail.",
    colors: ["Multicolor"],
    rating: 4.3,
  },
  {
    id: 5,
    name: "Beaded Bracelet",
    price: 14.99,
    tag: "Sale",
    category: "Bracelets",
    description:
      "Handcrafted beaded bracelet featuring semi-precious stones. Each piece is unique and makes a perfect gift.",
    colors: ["Blue", "Pink", "Green"],
    rating: 4.7,
  },
  {
    id: 6,
    name: "Charm Anklet",
    price: 16.99,
    tag: "",
    category: "Anklets",
    description:
      "Dainty anklet with small charms that catch the light as you move. Adjustable length for perfect fit.",
    colors: ["Silver", "Gold"],
    rating: 4.6,
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [activeImage, setActiveImage] = useState(0)
  const { toast } = useToast()
  const { addItem } = useCartStore()

  // Find the product based on the ID from the URL
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId) || products[0]

  // Sample images for the product
  const productImages = [
    `/placeholder.svg?height=600&width=600`,
    `/placeholder.svg?height=600&width=600`,
    `/placeholder.svg?height=600&width=600`,
    `/placeholder.svg?height=600&width=600`,
  ]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor || product.colors[0],
      quantity: Number.parseInt(quantity),
      image: productImages[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedColor || product.colors[0]}) has been added to your cart.`,
    })
  }

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Breadcrumb */}
      <section className="w-full py-4 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gray-900">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-gray-900">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="w-full py-8 md:py-12 animate-fadeIn">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-gray-100 dark:border-neutral-800">
                <Image
                  src={productImages[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square overflow-hidden rounded-md border ${
                      activeImage === index ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {product.tag && (
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-pink-100 text-pink-800">
                  {product.tag}
                </div>
              )}

              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">{product.rating} (120 reviews)</span>
              </div>

              <div className="text-2xl font-bold">${product.price}</div>

              <p className="text-gray-500">{product.description}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          selectedColor === color ? "bg-black text-white" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Select value={quantity} onValueChange={setQuantity}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Qty" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105 flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
                <Button size="icon" variant="outline" className="border-black hover:bg-gray-100">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>In stock and ready to ship</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <div className="space-y-4">
                  <p>
                    {product.description} Our accessories are designed with quality materials to ensure durability and
                    comfort.
                  </p>
                  <p>
                    Each piece is carefully crafted to add the perfect finishing touch to your outfit, whether for
                    everyday wear or special occasions.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Product Details</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Material: High-quality materials</li>
                    <li>Available Colors: {product.colors.join(",")}</li>
                    <li>Care Instructions: Gentle cleaning with soft cloth</li>
                    <li>Packaging: Comes in a gift-ready box</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Customer Reviews</h4>
                    <Button variant="outline">Write a Review</Button>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                            <div>
                              <div className="font-medium">Customer {review}</div>
                              <div className="text-xs text-gray-500">2 weeks ago</div>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          Love this product! The quality is excellent and it looks even better in person. Would
                          definitely recommend.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link
                    href={`/shop/${relatedProduct.id}`}
                    key={relatedProduct.id}
                    className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md hover-lift dark:border-neutral-800"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 image-hover">
                      <Image
                        src={`/placeholder.svg?height=300&width=300`}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{relatedProduct.name}</h3>
                      <p className="text-gray-500 text-sm">${relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
