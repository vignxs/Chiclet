import Link from "next/link"
import { Instagram, Twitter, Facebook, Mail } from "lucide-react"

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
