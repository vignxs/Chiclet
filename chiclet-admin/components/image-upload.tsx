/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadProductImage, validateImageFile } from "@/lib/storage"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  label?: string
}

export function ImageUpload({ currentImage, onImageChange, label = "Product Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    // Upload file
    setUploading(true)
    try {
      const imageUrl = await uploadProductImage(file)
      onImageChange(imageUrl)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Hidden file input */}
      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {preview ? (
          <div className="relative">
            <div className="relative w-full h-48 mb-4">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Product preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button type="button" variant="outline" onClick={triggerFileSelect} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleRemoveImage} disabled={uploading}>
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No image selected</p>
            <Button type="button" variant="outline" onClick={triggerFileSelect} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload guidelines */}
      <div className="text-sm text-gray-500">
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Recommended dimensions: 800x800px or higher</p>
      </div>
    </div>
  )
}
