import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"
import { sendWelcomeEmail } from "./sendEmail"

// Remove the custom OAuthResponse type - we'll use Supabase's built-in types

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

let authStateListener: any = null

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      // Initialize auth state listener
      const initializeAuthListener = () => {
        if (authStateListener) {
          authStateListener.unsubscribe()
          authStateListener = null
        }
        
        authStateListener = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state change:', event)
          
          if (event === "SIGNED_IN" && session?.user) {
            console.log('User signed in:', session.user.email)
            set({
              user: session.user,
              isAuthenticated: true,
            })
          } else if (event === "SIGNED_OUT") {
            console.log('User signed out')
            set({
              user: null,
              isAuthenticated: false,
            })
          }
        })
      }

      // Initialize auth listener when store is created
      initializeAuthListener()

      return {
        user: null,
        isAuthenticated: false,
        signInWithGoogle: async () => {
          try {
            console.log('Starting Google sign-in process')
            
            // Check if we're already signed in
            const { data, error } = await supabase.auth.getUser()
            if (data?.user) {
              console.log('Already signed in:', data.user.email)
              return
            }

            // Start OAuth flow
            const response = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            })

            console.log('Google OAuth response:', {
              provider: response.data?.provider,
              url: response.data?.url,
              error: response.error?.message
            })

            if (response.error) {
              console.error('Failed to sign in with Google:', response.error)
              throw response.error
            }

            if (response.data) {
              console.log('Successfully received OAuth response')
              
              // Wait for the auth state change event
              return new Promise<void>((resolve) => {
                const { data: authState } = supabase.auth.onAuthStateChange((event, session) => {
                  if (event === "SIGNED_IN" && session?.user) {
                    console.log('User signed in:', session.user.email)
                    
                    // Send welcome email after successful sign-in
                    try {
                      const pass_name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
                      console.log('Sending welcome email to:', session.user.email, 'with name:', pass_name)
                      
                      // Send email immediately
                      sendWelcomeEmail({
                        to_email: session.user.email!,
                        pass_name,
                      })
                      .then(() => {
                        console.log('Welcome email initiated')
                        resolve()
                      })
                      .catch(error => {
                        console.error('Failed to send welcome email:', error)
                        resolve() // Don't block sign-in if email fails
                      })
                    } catch (error) {
                      console.error('Failed to send welcome email:', error)
                      resolve() // Don't block sign-in if email fails
                    }
                  }
                })
              })
            }
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
