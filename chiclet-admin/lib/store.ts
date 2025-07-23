import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface AdminState {
  selectedOrderId: string | null
  setSelectedOrderId: (id: string | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const useAdminStore = create<AdminState>()(
  devtools(
    (set) => ({
      selectedOrderId: null,
      setSelectedOrderId: (id) => set({ selectedOrderId: id }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      currentPage: "dashboard",
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: "admin-store",
    },
  ),
)
