import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"
import { sendWelcomeEmail } from "./sendEmail"

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
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
            const { data: existingUser } = await supabase.auth.getUser()
            if (existingUser?.user) return

            const response = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            })

            if (response.error) throw response.error

            return new Promise<void>((resolve) => {
              const { data: authListener } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                  if (event === "SIGNED_IN" && session?.user) {
                    const pass_name =
                      session.user.user_metadata?.full_name ||
                      session.user.email?.split("@")[0] ||
                      "User"

                    try {
                      await sendWelcomeEmail({
                        to_email: session.user.email!,
                        pass_name,
                      })
                    } catch {
                      // Swallow errors, email is not critical
                    } finally {
                      resolve()
                      authListener.subscription?.unsubscribe()
                    }
                  }
                }
              )
            })
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
