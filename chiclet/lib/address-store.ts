import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth"
import { supabase } from "./supabaseClient"

export type Address = {
  id: number
  user_id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  createdAt: string
}

type AddressStore = {
  addresses: Address[]
  fetchAddresses: () => Promise<void>;
  addAddress: (userId: string, address: Omit<Address, "id" | "user_id" | "createdAt">) => Promise<Address | null>
  updateAddress: (id: number, address: Partial<Omit<Address, "id" | "user_id" | "createdAt">>) => Promise<void>
  deleteAddress: (id: number) =>  Promise<void>
  getAddressesByUserId: (userId: string) => Address[]
}


export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],

      fetchAddresses: async () => {
        const user = useAuthStore.getState().user
        if (!user) return

        const { data, error } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching addresses:", error)
          return
        }

        set({ addresses: data || [] })
      },


      addAddress: async (userId, address) => {

        console.log("Adding address:", address)
        const { data, error } = await supabase
          .from("user_addresses")
          .insert({
            ...address,
            user_id: userId,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error || !data) {
          console.error("Error adding address:", error)
          return null
        }

        set((state) => ({
          addresses: [data, ...state.addresses],
        }))

        return data
      },
      updateAddress: async (id, updatedAddress) => {

        const { error } = await supabase
          .from("user_addresses")
          .update(updatedAddress)
          .eq("id", id)

        if (error) {
          console.error("Error updating address:", error)
          return
        }

        set((state) => ({

          
          addresses: state.addresses.map((address) =>
            address.id === id
              ? {
                  ...address,
                  ...updatedAddress,
                }
              : address,
          ),
        }))
      },

      deleteAddress: async (id) => {
        const { error } = await supabase
          .from("user_addresses")
          .delete()
          .eq("id", id)

        if (error) {
          console.error("Error deleting address:", error)
          return
        }
        set((state) => ({
          addresses: state.addresses.filter((address) => address.id !== id),
        }))
      },
      getAddressesByUserId: (userId) => {
        console.log("Fetching addresses for user:", get().addresses, userId)
        return get().addresses.filter((address) => address.user_id === userId)
      },
    }),
    {
      name: "chiclet-addresses",
    },
  ),
)
