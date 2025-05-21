import { create } from "zustand"
import { supabase } from "./supabaseClient"

type Profile = {
  id: string
  full_name: string
  role: string
  created_at: string
}

type ProfilesState = {
  profiles: Profile[]
  isLoading: boolean
  error: string | null
  fetchProfiles: () => Promise<void>
  getProfile: (id: string) => Promise<Profile | null>
  isAdmin: (id: string) => Promise<boolean>
  updateProfile: (id: string, data: Partial<Profile>) => Promise<void>
}

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,

  fetchProfiles: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ profiles: data || [], isLoading: false })
    } catch (error) {
      console.error("Error fetching profiles:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  getProfile: async (id: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  },

  isAdmin: async (id: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("role").eq("id", id).single()

      if (error) throw error

      return data?.role === "admin"
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  },

  updateProfile: async (id: string, data: Partial<Profile>) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.from("profiles").update(data).eq("id", id)

      if (error) throw error

      // Refresh profiles after update
      get().fetchProfiles()
    } catch (error) {
      console.error("Error updating profile:", error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },
}))
