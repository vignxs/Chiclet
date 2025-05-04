import Categories from "@/components/categories"
import FeaturedProducts from "@/components/featured-products"
import ProductShowcase from "@/components/product-showcase"
import AboutUs from "@/components/about-us"
import ContactUs from "@/components/contact-us"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection />

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
