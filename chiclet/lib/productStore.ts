import { create } from "zustand"
import { supabase } from "./supabaseClient"

export type Product = {
    id: number;
    name: string;
    price: number;
    tag: string;
    category: string;
    description: string;
    rating: number;
    image: string;
  };

type ProductStore = {
  products: Product[]
  fetchProducts: () => Promise<void>
  loading: boolean
  error: string | null
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        tag,
        category,
        description,
        rating,
        image
      `);

    console.log("Products data:", data);
    console.log("Products error:", error);
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ products: data || [], loading: false });
    }
  },
}));
