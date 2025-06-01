"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle } = useAuthStore()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      await signInWithGoogle()
      // The redirect to the OAuth provider will happen automatically
      // The success handling will occur in the callback route
    } catch (error) {
      console.error(error)
      toast.error("Sign in failed", {
        description: "An error occurred during sign in. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">LPR Designs</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/signup" className="font-medium text-pink-600 hover:text-pink-500">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-6 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FcGoogle className="mr-2 h-5 w-5" />}
            <span className="text-base font-medium">Sign in with Google</span>
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>By signing in, you agree to our</p>
            <p>
              <Link href="#" className="font-medium text-pink-600 hover:text-pink-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-pink-600 hover:text-pink-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
