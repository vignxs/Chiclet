"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function ProductShowcase() {
  const { addItem } = useCartStore()
  const { toast } = useToast()

  const products = [
    { id: 1, name: "Crystal Hair Clips", price: 12.99, tag: "Bestseller", category: "Hair" },
    { id: 2, name: "Pearl Earrings", price: 18.99, tag: "New", category: "Earrings" },
    { id: 3, name: "Butterfly Necklace", price: 24.99, tag: "Limited", category: "Necklaces" },
    { id: 4, name: "Scrunchie Set", price: 9.99, tag: "", category: "Hair" },
    { id: 5, name: "Beaded Bracelet", price: 14.99, tag: "Sale", category: "Bracelets" },
    { id: 6, name: "Charm Anklet", price: 16.99, tag: "", category: "Anklets" },
  ]

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: `/placeholder.svg?height=400&width=400`,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Best Sellers</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Discover our most popular accessories that everyone loves
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md dark:border-neutral-800"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={`/placeholder.svg?height=400&width=400`}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {product.tag && (
                <div className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded">
                  {product.tag}
                </div>
              )}

              <div className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500">${product.price}</p>
                <Button
                  className="w-full mt-3 bg-black text-white hover:bg-gray-800"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="border-black text-black hover:bg-gray-100">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
