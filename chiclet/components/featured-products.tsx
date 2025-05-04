import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeaturedProducts() {
  return (
    // <section className="w-full py-12 md:py-24">
    <section className="relative w-full py-20 md:py-20 mt-8 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Moved to top-left corner */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>

        {/* Moved to top-right corner */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-pink-200 opacity-30 blur-3xl"></div>

        {/* Moved to bottom-left corner */}
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-yellow-100 opacity-30 blur-3xl"></div>
      </div>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">New Arrivals</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Check out our latest collection of trendy accessories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { id: 1, name: "Summer Collection", image: "https://img.freepik.com/free-photo/sunglasses-swimwear-straw-hat-summer-generated-by-ai_24640-81256.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740", description: "Bright and colorful accessories for sunny days" },
            { id: 2, name: "Elegant Series", image: "https://img.freepik.com/free-photo/ornate-jewelry-boxes-art-nouveau-style_23-2150975551.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740", description: "Sophisticated pieces for special occasions" },
            { id: 3, name: "Everyday Essentials", image: "https://img.freepik.com/free-photo/collection-beauty-care-products-with-pink-tones_23-2151005547.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740", description: "Must-have accessories for your daily outfits" },
          ].map((collection, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md dark:border-neutral-800"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{collection.name}</h3>
                <p className="text-gray-500 mt-1">{collection.description}</p>
                <Link href="/shop">
                  <Button className="w-full mt-3 bg-black text-white hover:bg-gray-800">Shop Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
