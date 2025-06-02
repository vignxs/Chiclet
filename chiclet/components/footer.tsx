import { Instagram } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 bg-white border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-8 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-pink-500">Home</Link></li>
              <li><Link href="#" className="hover:text-pink-500">Shop</Link></li>
              <li><Link href="#" className="hover:text-pink-500">Collections</Link></li>
              <li><Link href="#" className="hover:text-pink-500">About</Link></li>
              <li><Link href="#" className="hover:text-pink-500">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Categories</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-500">
              <li><Link href="/shop?category=Earrings" className="hover:text-pink-500">Earrings</Link></li>
              <li><Link href="/shop?category=Necklaces" className="hover:text-pink-500">Necklaces</Link></li>
              <li><Link href="/shop?category=Hair" className="hover:text-pink-500">Hair</Link></li>
              <li><Link href="/shop?category=Bracelets" className="hover:text-pink-500">Bracelets</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Follow Us</h3>
            <ul className="flex items-center gap-4 text-gray-500">
              <li>
                <Link
                  href="https://www.instagram.com/lprdesigns?igsh=MTd6bGIxajgxMmd3Ng=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </Link>
              </li>

              {/* Add other icons like Facebook, Twitter here if needed */}
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
