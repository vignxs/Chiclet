import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isAuthLoading: boolean // 👈 ADD THIS
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthLoading: true, // 👈 INITIALLY TRUE
      signInWithGoogle: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })

          if (error) {
            console.error("Error signing in with Google:", error)
            throw error
          }
        } catch (error) {
          console.error("Unexpected error during Google sign-in:", error)
          throw error
        }
      },
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut()

          if (error) {
            console.error("Error signing out:", error)
            throw error
          }

          set({
            user: null,
            isAuthenticated: false,
            isAuthLoading: false, // 👈 RESET LOADING
          })
        } catch (error) {
          console.error("Unexpected error during sign-out:", error)
          throw error
        }
      },
    }),
    {
      name: "chiclet-auth",
      onRehydrateStorage: () => {
        return (rehydratedState) => {
          const checkUser = async () => {
            const { data } = await supabase.auth.getUser()
            if (data.user) {
              console.log("User found in session:", data.user)
              useAuthStore.setState({
                user: data.user,
                isAuthenticated: true,
                isAuthLoading: false, // ✅ AUTH DONE
              })
            } else {
              useAuthStore.setState({
                user: null,
                isAuthenticated: false,
                isAuthLoading: false, // ✅ AUTH DONE
              })
            }
          }

          checkUser()

          supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              useAuthStore.setState({
                user: session.user,
                isAuthenticated: true,
                isAuthLoading: false,
              })
            } else if (event === "SIGNED_OUT") {
              useAuthStore.setState({
                user: null,
                isAuthenticated: false,
                isAuthLoading: false,
              })
            }
          })
        }
      },
    },
  ),
)
