import Image from "next/image"
import Link from "next/link"

export default function Categories() {
  const categories = [
    { name: "Earrings", image: "https://img.freepik.com/premium-photo/gold-jhumka_1188452-6995.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740" },
    { name: "Necklaces", image: "https://img.freepik.com/free-photo/young-woman-exudes-elegance-traditional-sari-generated-by-ai_188544-38358.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740" },
    { name: "Hair Accessories", image: "https://img.freepik.com/free-photo/luxury-bouquet-ornate-yellow-flower-petals-generated-by-ai_188544-41814.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740" },
    { name: "Bracelets", image: "https://img.freepik.com/free-photo/multi-colored-gemstone-jewelry-symbol-elegance-generated-by-ai_188544-27715.jpg?uid=R56299312&ga=GA1.1.120496150.1741877174&semt=ais_hybrid&w=740" },
  ]

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Shop by Category</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Find the perfect accessories for every occasion
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
          {categories.map((category, i) => (
            <Link
              key={i}
              href="/shop"
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-30">
                <h3 className="text-white font-medium text-lg md:text-xl">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
