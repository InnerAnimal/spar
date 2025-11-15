'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/image-upload'

interface Animal {
  id: string
  name: string
  type: string
  breed: string | null
  age: number | null
  status: string
}

interface AnimalImage {
  id: string
  url: string
  filename: string
  isPrimary: boolean
  order: number
}

export default function AnimalPhotosPage() {
  const params = useParams()
  const router = useRouter()
  const animalId = params.id as string

  const [animal, setAnimal] = useState<Animal | null>(null)
  const [images, setImages] = useState<AnimalImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnimalAndImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/animals/${animalId}`)
      if (!response.ok) {
        throw new Error('Animal not found')
      }
      const data = await response.json()
      setAnimal(data.animal)
      setImages(data.animal.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load animal')
    } finally {
      setLoading(false)
    }
  }, [animalId])

  useEffect(() => {
    fetchAnimalAndImages()
  }, [fetchAnimalAndImages])

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(`/api/animals/${animalId}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/animals/${animalId}/images/${imageId}/primary`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to set primary image')
      }

      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary image')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch(`/api/animals/${animalId}/images/${imageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      await fetchAnimalAndImages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p>Loading...</p>
      </div>
    )
  }

  if (error && !animal) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <Link
            href="/admin/animals"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to Animals
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/animals"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Animals
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Photos: {animal?.name}
        </h1>
        <p className="text-gray-600">
          Upload and manage photos for this animal. Drag and drop up to 10 images at once.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Photos</h2>
        <ImageUpload
          onUpload={handleUpload}
          maxFiles={10}
          maxSizeMB={10}
          disabled={uploading}
        />
      </div>

      {/* Existing Images */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Current Photos ({images.length})
        </h2>

        {images.length === 0 ? (
          <p className="text-gray-500">No photos uploaded yet. Upload some photos above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images
              .sort((a, b) => {
                if (a.isPrimary) return -1
                if (b.isPrimary) return 1
                return a.order - b.order
              })
              .map((image) => (
                <div
                  key={image.id}
                  className={`relative border rounded-lg overflow-hidden ${
                    image.isPrimary ? 'border-green-500 border-2' : 'border-gray-200'
                  }`}
                >
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold z-10">
                      PRIMARY
                    </div>
                  )}
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 bg-white">
                    <p className="text-xs text-gray-500 truncate mb-3">{image.filename}</p>
                    <div className="flex gap-2">
                      {!image.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(image.id)}
                          className="flex-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
