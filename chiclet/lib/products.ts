import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ProductCategory = "Hair" | "Earrings" | "Necklaces" | "Bracelets" | "Rings" | "Anklets" | "Other"

export type ProductTag = "Bestseller" | "New" | "Limited" | "Sale" | ""

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: ProductCategory
  tag: ProductTag
  images: string[]
  colors: string[]
  stock: number
  createdAt: string
  updatedAt: string
}

interface ProductsState {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Product
  updateProduct: (id: number, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => void
  deleteProduct: (id: number) => void
  getProductById: (id: number) => Product | undefined
}

// Generate a random ID for new products
const generateId = () => Math.floor(Math.random() * 10000)

// Sample mock data for demonstration
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Crystal Hair Clips",
    description:
      "Elegant crystal hair clips that add a touch of sparkle to any hairstyle. Perfect for special occasions or everyday glamour.",
    price: 12.99,
    category: "Hair",
    tag: "Bestseller",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["Silver", "Gold", "Rose Gold"],
    stock: 25,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Pearl Earrings",
    description:
      "Classic pearl earrings with a modern twist. These versatile studs complement both casual and formal outfits.",
    price: 18.99,
    category: "Earrings",
    tag: "New",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["White", "Cream", "Black"],
    stock: 15,
    createdAt: "2023-02-20T14:45:00Z",
    updatedAt: "2023-02-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Butterfly Necklace",
    description: "Delicate butterfly pendant on a fine chain. This necklace symbolizes transformation and beauty.",
    price: 24.99,
    category: "Necklaces",
    tag: "Limited",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["Silver", "Gold"],
    stock: 10,
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
  {
    id: 4,
    name: "Scrunchie Set",
    description:
      "Set of 5 premium scrunchies in various colors and patterns. Gentle on hair while adding a stylish touch to your ponytail.",
    price: 9.99,
    category: "Hair",
    tag: "",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["Multicolor"],
    stock: 30,
    createdAt: "2023-04-05T11:20:00Z",
    updatedAt: "2023-04-05T11:20:00Z",
  },
  {
    id: 5,
    name: "Beaded Bracelet",
    description:
      "Handcrafted beaded bracelet featuring semi-precious stones. Each piece is unique and makes a perfect gift.",
    price: 14.99,
    category: "Bracelets",
    tag: "Sale",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["Blue", "Pink", "Green"],
    stock: 20,
    createdAt: "2023-05-12T13:40:00Z",
    updatedAt: "2023-05-12T13:40:00Z",
  },
  {
    id: 6,
    name: "Charm Anklet",
    description:
      "Dainty anklet with small charms that catch the light as you move. Adjustable length for the perfect fit.",
    price: 16.99,
    category: "Anklets",
    tag: "",
    images: ["/placeholder.svg?height=600&width=600"],
    colors: ["Silver", "Gold"],
    stock: 18,
    createdAt: "2023-06-08T16:30:00Z",
    updatedAt: "2023-06-08T16:30:00Z",
  },
]

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      addProduct: (product) => {
        const newProduct: Product = {
          id: generateId(),
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          products: [...state.products, newProduct],
        }))

        return newProduct
      },
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updatedProduct,
                  updatedAt: new Date().toISOString(),
                }
              : product,
          ),
        }))
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }))
      },
      getProductById: (id) => {
        return get().products.find((product) => product.id === id)
      },
    }),
    {
      name: "chiclet-products",
    },
  ),
)
