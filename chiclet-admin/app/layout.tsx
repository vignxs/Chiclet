import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Chiclet Admin",
  description: "Admin dashboard for Chiclet store",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth light" style={{ scrollBehavior: "smooth", colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
