import { Instagram } from "lucide-react";
import Link from "next/link";
import { MdEmail as MailIcon } from "react-icons/md";
import { FaWhatsapp as WhatsAppIcon } from "react-icons/fa";
import { FiPhone as PhoneIcon } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-16 bg-white border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-16">
          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-8 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-pink-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Categories</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-500">
              <li>
                <Link
                  href="/shop?category=Earrings"
                  className="hover:text-pink-500"
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Necklaces"
                  className="hover:text-pink-500"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Bangles"
                  className="hover:text-pink-500"
                >
                  Bangles
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Haram"
                  className="hover:text-pink-500"
                >
                  Haram
                </Link>
              </li>
            </ul>
          </div>
     
        </div>
             <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <h3 className="text-sm font-medium text-gray-700">Follow Us</h3>
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 text-gray-500">
              {/* Instagram */}
              <li className="flex items-center gap-2 text-sm hover:text-pink-500 transition-colors">
                <a
                  href="https://www.instagram.com/lprdesigns"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-2 text-sm">
                <MailIcon className="h-5 w-5" />
                <span className="break-all">lprdesigns2025@gmail.com</span>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-2 text-sm">
                <PhoneIcon className="h-5 w-5" />
                <span>+91 96770 04469</span>
              </li>

              {/* WhatsApp */}
              <li className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors">
                <a
                  href="https://wa.me/918870184209?text=Hello%2C%20I%20would%20like%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
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
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} LPR Designs. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
