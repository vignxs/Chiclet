"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthGuard } from "@/components/auth-guard"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push("/admin")
      } else {
        router.push("/auth/signin")
      }
    }

    checkAuth()
  }, [router])

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2568AC]"></div>
      </div>
    </AuthGuard>
  )
}
