
"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuthStore } from "@/lib/auth"
import { useCartStore } from "./store"
import { useProductStore } from "./productStore"
import { useAddressStore } from "./address-store"

export const AuthInitializer = () => {
  const setAuth = useAuthStore.setState
  const { fetchCart } = useCartStore()
  const { fetchProducts } = useProductStore()
  const { fetchAddresses } = useAddressStore()

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser()
      fetchProducts()

      if (data.user) {
        setAuth({ user: data.user, isAuthenticated: true })
        fetchCart()
        fetchAddresses()
      }
    }

    initAuth()
  }, [fetchCart, fetchProducts, setAuth])

  return null
}
