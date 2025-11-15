'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Image as ImageIcon } from 'lucide-react'

interface Animal {
  id: string
  name: string
  type: string
  breed: string | null
  age: string
  status: string
  imageUrl: string | null
  _count?: {
    images: number
  }
}

export default function AnimalsAdminPage() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/animals')
      if (!response.ok) throw new Error('Failed to fetch animals')
      const data = await response.json()
      setAnimals(data.animals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading animals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Animals</h1>
        <p className="text-gray-600">Add and edit animal listings with photos</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        <Link
          href="/app/admin/animals/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Animal
        </Link>
      </div>

      {/* Animals Grid */}
      {animals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No animals yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first animal</p>
          <Link
            href="/app/admin/animals/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Animal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {animal.imageUrl ? (
                  <img
                    src={animal.imageUrl}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {animal._count && animal._count.images > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {animal._count.images} photo{animal._count.images > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {animal.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {animal.breed || animal.type} • {animal.age}
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    animal.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : animal.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {animal.status}
                </span>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/app/admin/animals/${animal.id}/edit`}
                    className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </Link>
                  <Link
                    href={`/app/admin/animals/${animal.id}/photos`}
                    className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Photos
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
