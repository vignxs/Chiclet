"use client"
import { useState } from "react"
import { signInWithGoogle } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Chrome } from "lucide-react"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#2568AC] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>Sign in with your Google account to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-gray-700 border border-neutral-200 border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2 dark:border-neutral-800"
          >
            <Chrome className="w-5 h-5" />
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </Button>

          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium">Admin Access Only</p>
            <p>Only authorized administrators can access this dashboard.</p>
            <p>Contact your system administrator if you need access.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
