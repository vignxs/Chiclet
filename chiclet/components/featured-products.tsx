"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useProductStore } from "@/lib/productStore";


export default function FeaturedProducts() {
    const { products: featuredProducts } = useProductStore();
  return (
    <section className="relative w-full py-20 md:py-20 mt-8 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-pink-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-yellow-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">New Arrivals</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Check out our latest collection of trendy accessories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
          {featuredProducts.slice(-3).map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md dark:border-neutral-800"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500 mt-1 text-sm">{product.description}</p>
                <p className="mt-2 text-black font-semibold">₹{product.price.toFixed(2)}</p>
                <Link href={`/shop/${product.id}`}>
                  <Button className="w-full mt-3 bg-black text-white hover:bg-gray-800">Shop Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
