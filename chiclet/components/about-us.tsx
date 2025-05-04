import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
  return (
    <section id="about" className="w-full py-16 md:py-24 bg-gray-50 scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-200 rounded-full opacity-40"></div>
              <Image
                src="/chiclet.jpeg?height=600&width=600"
                alt="About Chiclet"
                width={600}
                height={600}
                className="relative z-10 rounded-lg shadow-lg object-cover w-full max-w-md mx-auto"
              />
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6 animate-slideIn">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-pink-100 text-pink-800">
              <span className="font-medium">Our Story</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">About Chiclet</h2>

            <p className="text-gray-600">
              Founded in 2020, Chiclet began with a simple mission: to create beautiful, affordable accessories that
              help everyone express their unique style. What started as a small collection of handcrafted pieces has
              grown into a beloved brand known for quality and creativity.
            </p>

            <p className="text-gray-600">
              Each Chiclet accessory is thoughtfully designed to add that perfect finishing touch to any outfit. We
              believe that accessories aren&apos;t just add-ons—they&apos;re essential elements of self-expression that can
              transform both your look and your confidence.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <h3 className="font-bold text-xl">Our Vision</h3>
                <p className="text-gray-600 text-sm">
                  To inspire confidence through beautiful accessories that celebrate individuality.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xl">Our Promise</h3>
                <p className="text-gray-600 text-sm">
                  Quality materials, thoughtful design, and accessories that make you feel special.
                </p>
              </div>
            </div>

            <Button className="bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
