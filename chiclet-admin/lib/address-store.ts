import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Address = {
  id: number
  userId: string
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
  addAddress: (userId: string, address: Omit<Address, "id" | "userId" | "createdAt">) => Address
  updateAddress: (id: number, address: Partial<Omit<Address, "id" | "userId" | "createdAt">>) => void
  deleteAddress: (id: number) => void
  getAddressesByUserId: (userId: string) => Address[]
}

// Generate a random ID for new addresses
const generateId = () => Math.floor(Math.random() * 10000)

// Sample mock data for demonstration
const mockAddresses: Address[] = [
  {
    id: 1,
    userId: "google-oauth2|123456789",
    name: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    userId: "google-oauth2|123456789",
    name: "Work",
    street: "456 Business Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
    createdAt: "2023-03-20T14:45:00Z",
  },
]

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: mockAddresses,
      addAddress: (userId, address) => {
        const newAddress: Address = {
          id: generateId(),
          userId,
          ...address,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }))

        return newAddress
      },
      updateAddress: (id, updatedAddress) => {
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
      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((address) => address.id !== id),
        }))
      },
      getAddressesByUserId: (userId) => {
        return get().addresses.filter((address) => address.userId === userId)
      },
    }),
    {
      name: "chiclet-addresses",
    },
  ),
)
