import { create } from "zustand"
import { supabase } from "./supabaseClient"
import { useAuthStore } from "./auth"


export type CartItem = {
  id: number
  product_id: number
  name: string
  color?: string
  quantity: number
  image: string;
  price: number;
}

export type SaveCartItem = Omit<CartItem, 'id'>; // 'id' is intentionally omitted

type CartStore = {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (item: SaveCartItem) => Promise<void>; // Expects SaveCartItem
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};


export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    // Fetch cart items and related product data
    const { data, error } = await supabase
      .from("cart_items")
      .select(`*`)
      .eq("user_id", user.id);

    console.log("Fetched cart items:", data);

    if (error) {
      console.error("Error fetching cart:", error);
      return;
    }

    set({
      items: (data || []).map((item) => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      })),
    });
  },

  addItem: async (newItem: SaveCartItem) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const existing = get().items.find(
      (item) => item.product_id === newItem.product_id && item.color === newItem.color, // Changed to product_id
    )

    let updatedItem

    if (existing) {
      updatedItem = {
        ...existing,
        quantity: existing.quantity + newItem.quantity,
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: updatedItem.quantity })
        .eq("user_id", user.id)
        .eq("product_id", existing.product_id) // Changed to existing.product_id
        .eq("color", existing.color || null) // Changed to existing.color

      if (error) {
        console.error("Error updating quantity:", error)
        return
      }

      set((state) => ({
        items: state.items.map((item) =>
          item.product_id === updatedItem!.product_id && item.color === updatedItem!.color // Changed to product_id
            ? updatedItem!
            : item,
        ),
      }))
    } else {
      const itemToInsert = {
        user_id: user.id,
        product_id: newItem.product_id,
        name: newItem.name,
        image: newItem.image,
        price: newItem.price,
        color: newItem.color,    
        quantity: newItem.quantity,
      }
      const { data, error } = await supabase.from("cart_items").insert([itemToInsert]).select('*'); //added .select('*')

      if (error) {
        console.error("Error adding item:", error)
        return
      }
      const insertedItem: CartItem = data![0];

      set((state) => ({ items: [...state.items, insertedItem] })) // added insertedItem
    }
  },

  removeItem: async (id) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("id", id)

    if (error) {
      console.error("Error removing item:", error)
      return
    }

    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },

  updateQuantity: async (id, quantity) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("id", id)

    if (error) {
      console.error("Error updating quantity:", error)
      return
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    }))
  },

  clearCart: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)

    if (error) {
      console.error("Error clearing cart:", error)
      return
    }

    set({ items: [] })
  },
}))
