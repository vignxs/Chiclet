import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Auth change listener setup
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          set({
            user: session.user,
            isAuthenticated: true,
          })
        } else if (event === "SIGNED_OUT") {
          set({
            user: null,
            isAuthenticated: false,
          })
        }
      })

      return {
        user: null,
        isAuthenticated: false,
        signInWithGoogle: async () => {
          try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            })

            if (error) throw error
          } catch (error) {
            console.error("Google sign-in error:", error)
            throw error
          }
        },
        logout: async () => {
          try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            set({ user: null, isAuthenticated: false })
          } catch (error) {
            console.error("Logout error:", error)
            throw error
          }
        },
      }
    },
    {
      name: "chiclet-auth",
    }
  )
)
