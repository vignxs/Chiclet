"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) return null

  return (
    <section className="relative w-full py-20 md:py-32 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-pink-200 opacity-30 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-yellow-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-pink-100 text-pink-800"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="font-medium">✨ New Summer Collection 2025</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                <span className="block mb-2">Elevate Your Look</span>
                <TypewriterEffect words={words} />
              </h1>
              <motion.p
                className="text-gray-600 md:text-xl max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Discover our curated collection of trendy accessories that add the perfect finishing touch to every
                outfit. Handcrafted with love for the modern fashionista.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-black text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                View Collections
              </Button>
            </motion.div>

            {/* Featured badges */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium">Handcrafted</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-medium">Eco-friendly</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 opacity-70"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-200 to-pink-100 opacity-70"></div>

              {/* Floating accessories */}
              <motion.div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full shadow-lg overflow-hidden border-4 border-white z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
              >
                <Image
                  src="/Earrings2.jpeg?height=80&width=80"
                  alt="Earrings"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full shadow-lg overflow-hidden border-4 border-white z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, ease: "easeInOut" }}
              >
                <Image
                  src="/Bracelet.jpeg?height=64&width=64"
                  alt="Bracelet"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </motion.div>

              {/* Main image */}
              <div className="absolute inset-8 rounded-2xl overflow-hidden shadow-2xl z-10">
                <Image
                  src="https://img.freepik.com/free-photo/fashionable-modern-rococo-style_23-2151916460.jpg?height=500&width=500"
                  alt="Hero Image"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 z-30"
                animate={{
                  backgroundPosition: ["200%", "-200%"],
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
                style={{ backgroundSize: "200%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
