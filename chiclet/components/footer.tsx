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

          {/* Stay Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Stay Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Subscribe to our newsletter</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2 text-sm border border-neutral-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-neutral-800"
                />
                <button className="px-3 py-2 text-sm font-medium text-white bg-black rounded-r-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="text-center">
            <Link
              href="/"
              className="inline-block font-extrabold text-[100px] sm:text-[150px] md:text-[160px] lg:text-[240px] xl:text-[300px] 2xl:text-[350px] leading-none tracking-tight mb-4"
            >
              Chiclet
            </Link>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Chiclet. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
