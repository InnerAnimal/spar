'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { DonateSection } from '../../components/shared/DonateSection'
import { AdoptionButton } from '@/components/CTAButtons'

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
  age?: number | null
  gender?: string | null
  weight?: string | null
  price?: number | null
  imageUrl?: string | null
  description?: string | null
  spayedNeutered?: boolean
  vaccinated?: boolean
  microchipped?: boolean
  heartwormStatus?: string | null
  healthNotes?: string | null
  specialNote?: string | null
  fosterToAdopt?: boolean
  availableForReservation?: boolean
  status?: string
  images?: AnimalImage[]
}

// Fallback hardcoded animals in case database is not yet set up
const fallbackAnimals: Animal[] = [
  // DOGS
  {
    id: 'blue',
    name: 'Blue',
    type: 'dog',
    breed: 'Pitbull',
    age: 1,
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_a74339cd2f7d4d529c88d69dac74b51b~mv2.jpeg',
    healthNotes: 'Neutered, Heartworm Negative, 3-Year Rabies Vaccine, 3 sets of vaccines (DHPP/Bordetella), Microchipped',
  },
  {
    id: 'mabel',
    name: 'Mabel',
    type: 'dog',
    breed: 'Hound Mix',
    age: 2,
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_81c78060e43042d2b954225d5102e06e~mv2.jpg',
    healthNotes: 'Spayed, 3-Year Rabies Vaccine, DHPP and Bordetella Vaccines, Microchipped',
    specialNote: 'Heartworm treatment in progress',
  },
  {
    id: 'starla',
    name: 'Starla',
    type: 'dog',
    breed: 'Ratterian',
    age: 1,
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_3ef73c4731ca4be7a64a9ad0364aec7c~mv2.jpeg',
    healthNotes: 'Spayed, Heartworm Negative, 3-Year Rabies Vaccine, 3 sets of vaccines (DHPP/Bordetella), Microchipped',
  },
  {
    id: 'little-bit',
    name: 'Little Bit',
    type: 'dog',
    breed: 'Yorkie Mix',
    age: 5,
    weight: '18 lbs',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_8300941bb66647509d06c12ddab09e0e~mv2.jpeg',
    healthNotes: 'Fully Vetted, Spayed, Up to date on all vaccines, Microchipped',
  },
  {
    id: 'bodhi',
    name: 'Bodhi',
    type: 'dog',
    breed: 'Boxer',
    age: 1,
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_ec3c4ae1fd4247c59924016fdb3d1e0e~mv2.jpg',
    healthNotes: 'Neutered, Heartworm Negative, 3-Year Rabies Vaccine, 3 sets of vaccines (DHPP/Bordetella), Microchipped',
  },
  {
    id: 'lori',
    name: 'Lori',
    type: 'dog',
    breed: 'Ratterian',
    age: 1,
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_b93e6d53da344f97bac5177c4109964f~mv2.jpeg',
    healthNotes: 'Spayed, Heartworm Negative, 3-Year Rabies Vaccine, 3 sets of vaccines (DHPP/Bordetella), Microchipped',
  },
  {
    id: 'levo',
    name: 'Levo',
    type: 'dog',
    age: 4,
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_565016fa74f341b3aba3c02a563a85ac~mv2.jpg',
    healthNotes: 'Heartworm Positive (treatment provided), Sweet and loving personality, Needs quiet foster home',
    fosterToAdopt: true,
  },
  {
    id: 'rolo',
    name: 'Rolo',
    type: 'dog',
    age: 1,
    weight: '11 lbs',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_77899efe530d47e383407f1def488a72~mv2.jpeg',
    healthNotes: 'Heartworm Negative, Pad trained, Up to date on vaccines, Perfect for apartment living',
    specialNote: 'Very shy - needs patient family',
  },
  {
    id: 'priya',
    name: 'Priya',
    type: 'dog',
    breed: 'Chihuahua Mix',
    age: 0,
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_2017774f67df49799ebfacee7873dad5~mv2.jpeg',
    healthNotes: 'Currently being bottle fed, Will be spayed when age appropriate, Will receive full vaccination series',
    specialNote: 'Too young for adoption - available for reservation',
    availableForReservation: true,
  },
  {
    id: 'milo',
    name: 'Milo',
    type: 'dog',
    age: 1,
    weight: '11 lbs',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_527596d0a9314e6696e93cb2e924b24c~mv2.jpeg',
    healthNotes: 'Heartworm Negative, Pad trained, Up to date on vaccines, Perfect for apartment living',
    specialNote: 'Very shy - needs patient family',
  },
  // CATS
  {
    id: 'gouda',
    name: 'Gouda',
    type: 'cat',
    age: 0,
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_cc2d7ffdeee44a549eb1a8499900701f~mv2.jpeg',
    healthNotes: 'Spayed, Rabies Vaccine, FVRCP Vaccine, Combo tested, Wormed',
  },
  {
    id: 'roxie',
    name: 'Roxie',
    type: 'cat',
    breed: 'Grey Tabby',
    age: 0,
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_8fdfd556a1cf4934a8d35d2c2548907d~mv2.jpg',
    healthNotes: 'Will be spayed when age appropriate, First vaccines received, Needs experienced kitten family',
    specialNote: 'Vetting currently in process',
    availableForReservation: true,
  },
  {
    id: 'cheddar',
    name: 'Cheddar',
    type: 'cat',
    age: 0,
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_cc2d7ffdeee44a549eb1a8499900701f~mv2.jpeg',
    healthNotes: 'Neutered, Rabies Vaccine, FVRCP Vaccine, Combo tested, Wormed',
  },
  {
    id: 'fia',
    name: 'Fia',
    type: 'cat',
    age: 1,
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_83be9144080048929bd7f29773772361~mv2.jpeg',
    healthNotes: 'Fully Vetted, Spayed, Up to date on all vaccines, Microchipped',
  },
  {
    id: 'boo',
    name: 'Boo',
    type: 'cat',
    age: 0,
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_ce95191b903940bfa39b4facede27d07~mv2.jpeg',
    healthNotes: 'Neutered, Age-appropriate vaccines, Beautiful brown tabby markings, Playful kitten personality',
  },
  {
    id: 'pepperjack',
    name: 'Pepper Jack',
    type: 'cat',
    age: 0,
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_5286b3144fec4221ace60624db8035ff~mv2.jpeg',
    healthNotes: 'Neutered, Rabies Vaccine, FVRCP Vaccine, Combo tested, Wormed',
  },
]

export default function AdoptPage() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs')
  const [animals, setAnimals] = useState<Animal[]>(fallbackAnimals)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(true)

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      const response = await fetch('/api/animals?status=available')
      if (response.ok) {
        const data = await response.json()
        if (data.animals && data.animals.length > 0) {
          setAnimals(data.animals)
          setUsingFallback(false)
        }
      }
    } catch (error) {
      console.log('Database not yet configured, using sample data')
    } finally {
      setLoading(false)
    }
  }

  const dogs = animals.filter((a) => a.type === 'dog')
  const cats = animals.filter((a) => a.type === 'cat')
  const displayAnimals = activeTab === 'dogs' ? dogs : cats

  const getDisplayImage = (animal: Animal) => {
    // Try to get primary image from images array
    if (animal.images && animal.images.length > 0) {
      const primaryImage = animal.images.find((img) => img.isPrimary)
      if (primaryImage) return primaryImage.url
      return animal.images[0].url
    }
    // Fall back to legacy imageUrl
    return animal.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
  }

  const getAgeDisplay = (age: number | null | undefined) => {
    if (!age) return 'Puppy/Kitten'
    if (age < 1) return `${age} months old`
    if (age === 1) return '1 year old'
    return `${age} years old`
  }

  const getHealthItems = (animal: Animal) => {
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
      items.push(animal.heartwormStatus)
    }
    if (animal.healthNotes) {
      items.push(...animal.healthNotes.split(',').map(s => s.trim()))
    }

    return items.length > 0 ? items : ['Health information available upon inquiry']
  }

  const getButtonText = (animal: Animal) => {
    if (animal.fosterToAdopt) return 'Apply to Foster'
    if (animal.availableForReservation) return `Reserve ${animal.name}`
    return 'Apply to Adopt'
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

          {usingFallback && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                📝 <strong>Note:</strong> Showing sample data. Database configuration needed to display live animals.
              </p>
            </div>
          )}

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
              <p className="text-gray-600">Loading animals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-green-600"
                >
                  <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 bg-gray-100">
                    <Image
                      src={getDisplayImage(animal)}
                      alt={animal.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {animal.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {animal.breed && `${animal.breed} • `}
                    {getAgeDisplay(animal.age)} • {animal.gender || 'Unknown'}
                    {animal.weight && ` • ${animal.weight}`}
                  </p>

                  {animal.price && (
                    <div className="text-3xl font-bold text-green-600 mb-4">
                      ${animal.price}
                    </div>
                  )}

                  {animal.specialNote && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800 font-medium">
                      {animal.specialNote}
                    </div>
                  )}

                  {animal.fosterToAdopt && (
                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-gray-800 font-medium">
                      Foster-to-Adopt: Due to special care needs, this pet needs a loving foster home during treatment. We&apos;ll provide all medical care!
                    </div>
                  )}

                  <div className="mb-5">
                    <h4 className="font-semibold mb-2 text-sm">Health & Care:</h4>
                    <ul className="space-y-1">
                      {getHealthItems(animal).map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-green-600 before:font-bold"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <AdoptionButton
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {getButtonText(animal)}
                  </AdoptionButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Donate Section */}
      <DonateSection />
    </>
  )
}
