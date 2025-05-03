import Image from "next/image"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { Button } from "@/components/ui/button"
import ProductShowcase from "@/components/product-showcase"
import Categories from "@/components/categories"
import FeaturedProducts from "@/components/featured-products"
import AboutUs from "@/components/about-us"
import ContactUs from "@/components/contact-us"

export default function Home() {
  const words = [
    {
      text: "Accessorize",
    },
    {
      text: "Your",
    },
    {
      text: "Style",
    },
    {
      text: "with",
    },
    {
      text: "Chiclet",
      className: "text-pink-400",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      {/* <section className="relative w-full py-24   md:py-32 overflow-hidden"> */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-32 xl:py-20  2xl:py-40 overflow-hidden">

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-8 text-center md:text-left animate-slideUp">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-pink-100 text-pink-800 mb-4 animate-fadeIn">
                <span className="font-medium">New Collection: Summer Vibes</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  <TypewriterEffect words={words} />
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl">
                  Discover our curated collection of trendy accessories that add the perfect finishing touch to every
                  outfit.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 animate-fadeIn">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-black text-black hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
                >
                  View Collections
                </Button>
              </div>
            </div>

            <div className="flex-1 mt-8 md:mt-0">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-pink-100 rounded-full opacity-20"></div>
                <div className="absolute inset-4 bg-pink-200 rounded-full opacity-20"></div>
                <Image
                  src="https://img.freepik.com/free-photo/fashionable-modern-rococo-style_23-2151916460.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740"
                  alt="Hero Image"
                  fill
                  className="relative z-10 object-cover rounded-2xl shadow-lg animate-fadeIn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Us Section */}
      <AboutUs />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Contact Us Section */}
      <ContactUs />
    </main>
  )
}
