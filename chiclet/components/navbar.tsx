"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { AuthButton } from "@/components/auth-button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCartStore()
  const pathname = usePathname()

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

    // If we're on the home page, scroll to the section
    if (pathname === "/") {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      window.location.href = `/#${id}`
    }
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled ? "py-2" : "py-3"}`}>
      <div className="container mx-auto px-4">
        <div
          className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-[#FBC5FC]/60 backdrop-blur-md shadow-md" : "bg-[#FBC5FC]/10 backdrop-blur-sm"
            }`}
        >
          <div className="flex h-14 items-center justify-between px-6">

            <Link
              href="/"
              className="font-bold text-2xl" style={{ fontFamily: "'Glida Display', serif" }}
            >
              LPR Designs
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
              <AuthButton />
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
              <div className="pt-2 border-t">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
