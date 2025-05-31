import Link from "next/link"
import { Instagram, Twitter, Facebook, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 bg-white border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-pink-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/shop?category=Earrings" className="hover:text-pink-500 transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Necklaces" className="hover:text-pink-500 transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Hair" className="hover:text-pink-500 transition-colors">
                  Hair
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Bracelets" className="hover:text-pink-500 transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
          {/* Support & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Support & Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Email Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Phone Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500 transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="text-center">
            <Link
              href="/"
              className="inline-block font-extrabold text-[60px] sm:text-[50px] md:text-[120px] lg:text-[160px] xl:text-[200px] 2xl:text-[220px] leading-none tracking-tight mb-4"
              style={{ fontFamily: "'Glida Display', serif" }}
            >
              LPR Designs
            </Link>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} LPR Designs. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  )
}
