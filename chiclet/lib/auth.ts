import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Demo users for testing
const demoUsers = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://img.freepik.com/free-photo/3d-icon-travel-with-man_23-2151037415.jpg?height=40&width=40",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    avatar: "https://img.freepik.com/free-photo/3d-icon-travel-with-man_23-2151037415.jpg?height=40&width=40",
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        const user = demoUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
          })
          return true
        }

        return false
      },
      //
      signup: async (name, email, _password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if user already exists
        if (demoUsers.some((u) => u.email === email)) {
          return false
        }

        // In a real app, we would create a new user in the database
        const newUser = {
          id: String(demoUsers.length + 1),
          name,
          email,
          avatar: "/placeholder.svg?height=40&width=40",
        }

        set({
          user: newUser,
          isAuthenticated: true,
        })

        return true
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "chiclet-auth",
    },
  ),
)
