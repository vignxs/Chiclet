"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { checkAdminAccess } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Shield } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (!user) {
          router.push("/auth/signin")
          return
        }

        // Check if user is admin
        const hasAdminAccess = await checkAdminAccess(user.email!)
        setIsAdmin(hasAdminAccess)

        if (!hasAdminAccess) {
          setAccessDenied(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAdmin(false)
        router.push("/auth/signin")
        return
      }

      if (session?.user) {
        setUser(session.user)
        const hasAdminAccess = await checkAdminAccess(session.user.email!)
        setIsAdmin(hasAdminAccess)

        if (!hasAdminAccess) {
          setAccessDenied(true)
        } else {
          setAccessDenied(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2568AC] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
            <p className="text-sm text-gray-500">
              Signed in as: <strong>{user.email}</strong>
            </p>
            <p className="text-sm text-gray-500">Please contact your administrator to request access.</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
