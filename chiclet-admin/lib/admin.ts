import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "./supabaseClient"

type Admin = {
  id: string
  full_name?: string
}

interface AdminState {
  admins: Admin[]
  fetchAdmins: () => Promise<void>
  isAdmin: (userId: string) => boolean
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admins: [],
      fetchAdmins: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "admin")

        if (error) {
          console.error("Error fetching admins:", error)
          return
        }

        set({ admins: data || [] })
      },
      isAdmin: (userId: string) => {
        return get().admins.some((admin) => admin.id === userId)
      },
    }),
    {
      name: "chiclet-admins",
    },
  )
)
