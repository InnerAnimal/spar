'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DonateSection } from '../../components/shared/DonateSection'
import { AdoptionButton } from '@/components/CTAButtons'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type AnimalImage = {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

type Animal = {
  id: string
  name: string
  type: 'dog' | 'cat'
  breed?: string | null
  age: string
  gender: string
  price: number
  description?: string | null
  imageUrl?: string | null
  images: AnimalImage[]
  spayedNeutered: boolean
  vaccinated: boolean
  microchipped: boolean
  heartwormStatus?: string | null
  healthNotes?: string | null
  specialNote?: string | null
  fosterToAdopt: boolean
  availableForReservation: boolean
  status: string
}

function AnimalImageGallery({ images, name }: { images: AnimalImage[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-lg">No Image</span>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 bg-gray-100 group">
      <Image
        src={images[currentIndex].url}
        alt={`${name} - Photo ${currentIndex + 1}`}
        fill
        className="object-cover"
      />

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdoptPage() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs')
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/animals?status=available')
      if (!response.ok) throw new Error('Failed to fetch animals')
      const data = await response.json()
      setAnimals(data.animals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load animals')
    } finally {
      setLoading(false)
    }
  }

  const dogs = animals.filter((a) => a.type === 'dog')
  const cats = animals.filter((a) => a.type === 'cat')
  const displayAnimals = activeTab === 'dogs' ? dogs : cats

  // Build health items array
  const getHealthItems = (animal: Animal): string[] => {
    const items: string[] = []

    if (animal.spayedNeutered) {
      items.push(animal.gender === 'Male' ? 'Neutered' : 'Spayed')
    }
    if (animal.vaccinated) {
      items.push('Vaccinated')
    }
    if (animal.microchipped) {
      items.push('Microchipped')
    }
    if (animal.heartwormStatus) {
      items.push(`Heartworm: ${animal.heartwormStatus}`)
    }
    if (animal.healthNotes) {
      items.push(animal.healthNotes)
    }

    return items
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-12 px-5 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Every Animal Deserves a Loving Home
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Brothers like these remind us why keeping families together matters.
            Find your perfect companion today.
          </p>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('dogs')}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'dogs'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-600'
              }`}
            >
              <span className="text-2xl">🐕</span>
              <span>Dogs</span>
              <span className="text-sm opacity-80">({dogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('cats')}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-lg transition-all ${
                activeTab === 'cats'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-600'
              }`}
            >
              <span className="text-2xl">🐱</span>
              <span>Cats</span>
              <span className="text-sm opacity-80">({cats.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Animals Grid */}
      <section className="py-12 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading animals...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : displayAnimals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">
                No {activeTab} available for adoption at this time.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Check back soon or contact us for more information!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayAnimals.map((animal) => {
                const healthItems = getHealthItems(animal)
                const displayImages = animal.images.length > 0 ? animal.images : []

                return (
                  <div
                    key={animal.id}
                    className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-green-600"
                  >
                    <AnimalImageGallery images={displayImages} name={animal.name} />

                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {animal.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {animal.breed && `${animal.breed} • `}
                      {animal.age} • {animal.gender}
                    </p>

                    <div className="text-3xl font-bold text-green-600 mb-4">
                      ${animal.price}
                    </div>

                    {animal.description && (
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {animal.description}
                      </p>
                    )}

                    {animal.specialNote && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800 font-medium">
                        {animal.specialNote}
                      </div>
                    )}

                    {animal.fosterToAdopt && (
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-gray-800 font-medium">
                        Foster-to-Adopt Program Available
                      </div>
                    )}

                    {healthItems.length > 0 && (
                      <div className="mb-5">
                        <h4 className="font-semibold mb-2 text-sm">Health & Care:</h4>
                        <ul className="space-y-1">
                          {healthItems.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-bold"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <AdoptionButton
                      fullWidth
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {animal.availableForReservation
                        ? `Reserve ${animal.name}`
                        : animal.fosterToAdopt
                        ? 'Apply to Foster'
                        : 'Apply to Adopt'}
                    </AdoptionButton>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Donate Section */}
      <DonateSection />
    </>
  )
}
