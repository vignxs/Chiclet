import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          tag: string | null
          category: string | null
          description: string | null
          rating: number | null
          image: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          tag?: string | null
          category?: string | null
          description?: string | null
          rating?: number | null
          image?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          tag?: string | null
          category?: string | null
          description?: string | null
          rating?: number | null
          image?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          address_id: number | null
          total: number
          status: string
          created_at: string | null
          updated_at: string | null
          tracking_number: string | null
          payment_status: string | null
          razorpay_payment_id: string | null
        }
        Insert: {
          id: string
          user_id: string
          address_id?: number | null
          total: number
          status: string
          created_at?: string | null
          updated_at?: string | null
          tracking_number?: string | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          address_id?: number | null
          total?: number
          status?: string
          created_at?: string | null
          updated_at?: string | null
          tracking_number?: string | null
          payment_status?: string | null
          razorpay_payment_id?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: string | null
          product_id: number | null
          name: string
          price: number
          quantity: number
          image: string | null
        }
      }
      order_timeline: {
        Row: {
          id: number
          order_id: string | null
          status: string
          timestamp: string
        }
        Insert: {
          id?: number
          order_id?: string | null
          status: string
          timestamp?: string
        }
      }
      payments: {
        Row: {
          id: number
          razorpay_payment_id: string
          amount: number
          currency: string
          payment_status: string
          paid_at: string | null
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number | null
          name: string | null
          quantity: number
          price: number
          image: string | null
        }
      }
    }
  }
}
