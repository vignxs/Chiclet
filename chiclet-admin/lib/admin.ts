import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
}

interface AdminState {
  admins: AdminUser[]
  isAdmin: (userId: string) => boolean
}

// Sample mock data for demonstration
const mockAdmins: AdminUser[] = [
  {
    id: "google-oauth2|123456789",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  },
]

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admins: mockAdmins,
      isAdmin: (userId) => {
        return get().admins.some((admin) => admin.id === userId)
      },
    }),
    {
      name: "chiclet-admins",
    },
  ),
)
