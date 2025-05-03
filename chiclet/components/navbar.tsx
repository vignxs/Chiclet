"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCartStore()

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled ? "py-2" : "py-3"}`}>
      <div className="container mx-auto px-4">
        <div className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-white/80 backdrop-blur-sm"}`}>
          <div className="flex h-14 items-center justify-between px-6">
            <Link href="/" className="font-bold text-xl">
              Chiclet
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-pink-500">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium transition-colors hover:text-pink-500">
                Shop
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="text-sm font-medium transition-colors hover:text-pink-500"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-sm font-medium transition-colors hover:text-pink-500"
              >
                Contact
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                Shop Now
              </Button>
            </div>

            <div className="flex md:hidden items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md mt-2 rounded-xl shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-sm font-medium transition-colors hover:text-pink-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block text-sm font-medium transition-colors hover:text-pink-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-sm font-medium transition-colors hover:text-pink-500"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left text-sm font-medium transition-colors hover:text-pink-500"
              >
                Contact
              </button>
              <Button size="sm" className="w-full bg-black text-white hover:bg-gray-800">
                Shop Now
              </Button>
            </div>
          </div>
        )}
      </div>

    </header>
  )
}
