import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactUs() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-pink-100 text-pink-800">
            <span className="font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Contact Us</h2>
          <p className="text-gray-500 md:text-lg max-w-[700px] mx-auto">
            Have questions about our products or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="space-y-6 animate-slideIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input id="subject" placeholder="How can we help?" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea id="message" placeholder="Your message" rows={5} />
            </div>

            <Button className="w-full bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105">
              Send Message
            </Button>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Our Location</h3>
                    <p className="text-gray-600 text-sm">123 Fashion Street, Style City, SC 12345</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600 text-sm">hello@chiclet.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-5 h-5 text-pink-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Hours</h3>
                    <p className="text-gray-600 text-sm">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600 text-sm">Saturday: 10am - 4pm</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
              {/* This would be a map in a real implementation */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>Map Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
