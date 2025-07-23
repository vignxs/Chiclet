import { supabase } from "./supabase"

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const checkAdminAccess = async (userEmail: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("is_active")
      .eq("email", userEmail)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      return false
    }

    return data.is_active
  } catch (error) {
    console.error("Error checking admin access:", error)
    return false
  }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}
