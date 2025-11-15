'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Trash2 } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

interface AnimalImage {
  id: string
  url: string
  filename: string
  isPrimary: boolean
  order: number
  caption: string | null
}

interface Animal {
  id: string
  name: string
  type: string
  breed: string | null
}

export default function AnimalPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const animalId = params.id as string

  const [animal, setAnimal] = useState<Animal | null>(null)
  const [images, setImages] = useState<AnimalImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchAnimalAndImages()
  }, [animalId])

  const fetchAnimalAndImages = async () => {
    try {
      setLoading(true)

      // Fetch animal details
      const animalRes = await fetch(`/api/animals/${animalId}`)
      if (!animalRes.ok) throw new Error('Animal not found')
      const animalData = await animalRes.json()
      setAnimal(animalData.animal)

      // Fetch images
      const imagesRes = await fetch(`/api/animals/${animalId}/images`)
      if (!imagesRes.ok) throw new Error('Failed to fetch images')
      const imagesData = await imagesRes.json()
      setImages(imagesData.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files: File[]) => {
    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/animals/${animalId}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      // Refresh images after upload
      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err // Re-throw to let ImageUpload component handle it
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(
        `/api/animals/${animalId}/images?imageId=${imageId}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delete failed')
      }

      // Refresh images after deletion
      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/animals/${animalId}/images/primary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to set primary image')
      }

      // Refresh images
      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary image')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !animal) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
          <Link
            href="/privacy"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Back to Animals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/privacy"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Animals
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Photos: {animal?.name}
        </h1>
        <p className="text-gray-600">
          {animal?.breed || animal?.type} • Upload and manage animal photos
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload New Photos
        </h2>
        <ImageUpload
          onUpload={handleUpload}
          maxFiles={10}
          maxSizeMB={10}
          disabled={uploading}
          existingImages={images.map((img) => ({
            id: img.id,
            url: img.url,
            filename: img.filename,
          }))}
          onRemoveExisting={handleRemove}
        />
      </div>

      {/* Existing Images Gallery */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current Photos ({images.length})
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No photos uploaded yet. Use the upload area above to add photos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Primary
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                        title="Set as primary image"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(image.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filename */}
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Photo Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload clear, well-lit photos of the animal</li>
          <li>• The first photo (or primary photo) will be shown in listings</li>
          <li>• Click the star icon to set a different primary photo</li>
          <li>• Supported formats: JPG, PNG, GIF (max 10MB per image)</li>
          <li>• You can upload up to 10 images per animal</li>
        </ul>
      </div>
    </div>
  )
}
