
"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuthStore } from "@/lib/auth"
import { useCartStore } from "./store"
import { useProductStore } from "./productStore"

export const AuthInitializer = () => {
  const setUser = useAuthStore((state) => state.user)
  const setAuth = useAuthStore.setState
  const { fetchCart } = useCartStore()
  const { fetchProducts } = useProductStore()

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setAuth({ user: data.user, isAuthenticated: true })

        fetchProducts()
        fetchCart()
      }
    }

    initAuth()
  }, [fetchCart, fetchProducts,setAuth])

  return null
}
