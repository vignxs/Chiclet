import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: number
  name: string
  price: number
  color?: string
  quantity: number
  image: string
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id && item.color === newItem.color)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.color === newItem.color
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item,
              ),
            }
          }

          return { items: [...state.items, newItem] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "chiclet-cart",
    },
  ),
)
