import { create } from "zustand"
import { supabase } from "./supabaseClient"

export interface ProductColor {
  id: number
  product_id: number
  color: string
}

export interface Product {
  id: number
  name: string
  price: number
  tag: string | null
  category: string | null
  description: string | null
  rating: number | null
  image: string | null
  colors?: ProductColor[]
}

interface ProductsState {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  getProductById: (id: number) => Promise<Product | null>
  addProduct: (product: Omit<Product, "id">, colors: string[]) => Promise<Product | null>
  updateProduct: (id: number, product: Partial<Omit<Product, "id">>, colors?: string[]) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase.from("products").select("*").order("id")

      if (productsError) throw productsError

      // Fetch colors for all products
      const { data: colors, error: colorsError } = await supabase.from("product_colors").select("*")

      if (colorsError) throw colorsError

      // Combine products with their colors
      const productsWithColors = products.map((product: Product) => ({
        ...product,
        colors: colors.filter((color: ProductColor) => color.product_id === product.id),
      }))

      set({ products: productsWithColors, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error fetching products:", error)
    }
  },

  getProductById: async (id: number) => {
    try {
      // Fetch the product
      const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

      if (productError) throw productError

      // Fetch colors for the product
      const { data: colors, error: colorsError } = await supabase
        .from("product_colors")
        .select("*")
        .eq("product_id", id)

      if (colorsError) throw colorsError

      return { ...product, colors }
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  },

  addProduct: async (product, colors) => {
    set({ isLoading: true, error: null })
    try {
      // Insert the product
      const { data, error: productError } = await supabase.from("products").insert([product]).select()

      if (productError) throw productError

      const newProduct = data[0]

      // Insert colors if provided
      if (colors && colors.length > 0) {
        const colorObjects = colors.map((color) => ({
          product_id: newProduct.id,
          color,
        }))

        const { error: colorsError } = await supabase.from("product_colors").insert(colorObjects)

        if (colorsError) throw colorsError
      }

      // Refresh products list
      await get().fetchProducts()

      set({ isLoading: false })
      return newProduct
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error adding product:", error)
      return null
    }
  },

  updateProduct: async (id, productUpdates, colors) => {
    set({ isLoading: true, error: null })
    try {
      // Update the product
      const { error: productError } = await supabase.from("products").update(productUpdates).eq("id", id)

      if (productError) throw productError

      // Update colors if provided
      if (colors !== undefined) {
        // First delete existing colors
        const { error: deleteError } = await supabase.from("product_colors").delete().eq("product_id", id)

        if (deleteError) throw deleteError

        // Then insert new colors
        if (colors.length > 0) {
          const colorObjects = colors.map((color) => ({
            product_id: id,
            color,
          }))

          const { error: colorsError } = await supabase.from("product_colors").insert(colorObjects)

          if (colorsError) throw colorsError
        }
      }

      // Refresh products list
      await get().fetchProducts()

      set({ isLoading: false })
      return true
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error updating product:", error)
      return false
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // Delete the product (this will cascade delete colors due to FK constraint)
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      // Refresh products list
      await get().fetchProducts()

      set({ isLoading: false })
      return true
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error deleting product:", error)
      return false
    }
  },
}))
