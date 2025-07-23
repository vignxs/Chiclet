/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from "./supabase"

export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `photos/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("chiclet-resources").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("chiclet-resources").getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split("/")
    const filePath = pathParts.slice(-2).join("/") // Get 'photos/filename.ext'

    const { error } = await supabase.storage.from("chiclet-resources").remove([filePath])

    if (error) {
      console.error("Delete error:", error)
      throw error
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    // Don't throw error for delete failures to avoid blocking other operations
  }
}

export const validateImageFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return "Please select a valid image file (JPEG, PNG, or WebP)"
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return "Image size must be less than 5MB"
  }

  return null
}
