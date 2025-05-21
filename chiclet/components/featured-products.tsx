import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const featuredProducts = [
  {
    id: 10,
    name: "Layered Necklace",
    price: 29.99,
    tag: "Limited",
    category: "Necklaces",
    description:
      "Stylish layered necklace with delicate chains and subtle charms. A chic addition to your jewelry collection.",
    colors: ["Gold", "Silver"],
    rating: 4.7,
    image: "https://i.pinimg.com/736x/5e/13/58/5e135834ba9cf6224c97d7717e7a5f77.jpg",
  },
  {
    id: 11,
    name: "Velvet Scrunchies",
    price: 8.99,
    tag: "Sale",
    category: "Hair",
    description:
      "Soft velvet scrunchies in a range of rich colors. Comfortable and stylish for all-day wear.",
    colors: ["Burgundy", "Navy", "Emerald"],
    rating: 4.2,
    image: "https://i.pinimg.com/736x/f1/b4/b6/f1b4b69c18c61080caa4fcdb5307c524.jpg",
  },
  {
    id: 12,
    name: "Charm Bracelet",
    price: 17.99,
    tag: "",
    category: "Bracelets",
    description:
      "Charming bracelet featuring tiny pendants. Great for stacking or wearing as a standalone piece.",
    colors: ["Silver", "Gold", "Rose Gold"],
    rating: 4.4,
    image: "https://i.pinimg.com/736x/14/78/60/147860b56438d607179a6c3215d444b8.jpg",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="relative w-full py-20 md:py-20 mt-8 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-pink-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-pink-200 opacity-30 blur-3xl"></div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md dark:border-neutral-800"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500 mt-1 text-sm">{product.description}</p>
                <p className="mt-2 text-black font-semibold">${product.price.toFixed(2)}</p>
                <Link href={`/shop/${product.id}`}>
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
