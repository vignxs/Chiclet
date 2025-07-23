import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReactQueryProvider } from "@/components/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LPR Admin Dashboard",
  description: "E-commerce admin dashboard for managing orders, products, and payments",
  icons: {
    icon: "/favicon.ico", // path in public/
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
