"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { handleContactSubmit } from "@/lib/sendEmail"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleContactSubmit({
      formData,
      setIsLoading,
      setSuccessMessage,
      setErrorMessage,
      resetForm: () => setFormData({ name: "", email: "", subject: "", message: "" }),
    })
  }

  return (
    <section id="contact" className="w-full py-16 md:py-24 scroll-mt-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-pink-100 text-pink-800">
            <span className="font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Contact Us</h2>
          <p className="text-gray-500 md:text-lg max-w-[700px] mx-auto">
            Have questions about our products or need assistance? We&apos;re here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="space-y-6 animate-slideIn">
            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-medium">Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-black text-white hover:bg-gray-800 transition-transform duration-300 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>

          {/* Map Embed */}
          <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10515.422845558947!2d80.16575998565636!3d12.945218419768581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525e7153460433%3A0xff70169d93bb3d0b!2sKeelkattalai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1748692225707!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
