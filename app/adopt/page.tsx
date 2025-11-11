'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DonateSection } from '../../components/shared/DonateSection'
import { AdoptionButton } from '@/components/CTAButtons'

type Animal = {
  id: string
  name: string
  type: 'dog' | 'cat'
  breed?: string
  age: string
  gender: string
  weight?: string
  price: number
  imageUrl: string
  health: string[]
  specialNote?: string
  fosterNote?: string
  buttonText?: string
}

// Sample data - this would come from database
const animals: Animal[] = [
  // DOGS
  {
    id: 'blue',
    name: 'Blue',
    type: 'dog',
    breed: 'Pitbull',
    age: '11 months old',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_a74339cd2f7d4d529c88d69dac74b51b~mv2.jpeg',
    health: ['Neutered', 'Heartworm Negative', '3-Year Rabies Vaccine', '3 sets of vaccines (DHPP/Bordetella)', 'Microchipped'],
  },
  {
    id: 'mabel',
    name: 'Mabel',
    type: 'dog',
    breed: 'Hound Mix',
    age: '2 years old',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_81c78060e43042d2b954225d5102e06e~mv2.jpg',
    health: ['Spayed', '3-Year Rabies Vaccine', 'DHPP and Bordetella Vaccines', 'Microchipped', 'Heartworm treatment in progress'],
    specialNote: 'Currently undergoing heartworm treatment',
  },
  {
    id: 'starla',
    name: 'Starla',
    type: 'dog',
    breed: 'Ratterian',
    age: '1.5 years old',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_3ef73c4731ca4be7a64a9ad0364aec7c~mv2.jpeg',
    health: ['Spayed', 'Heartworm Negative', '3-Year Rabies Vaccine', '3 sets of vaccines (DHPP/Bordetella)', 'Microchipped'],
  },
  {
    id: 'little-bit',
    name: 'Little Bit',
    type: 'dog',
    breed: 'Yorkie Mix',
    age: '5 years old',
    weight: '18 lbs',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_8300941bb66647509d06c12ddab09e0e~mv2.jpeg',
    health: ['Fully Vetted', 'Spayed', 'Up to date on all vaccines', 'Microchipped'],
  },
  {
    id: 'bodhi',
    name: 'Bodhi',
    type: 'dog',
    breed: 'Boxer',
    age: '11 months old',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_ec3c4ae1fd4247c59924016fdb3d1e0e~mv2.jpg',
    health: ['Neutered', 'Heartworm Negative', '3-Year Rabies Vaccine', '3 sets of vaccines (DHPP/Bordetella)', 'Microchipped'],
  },
  {
    id: 'lori',
    name: 'Lori',
    type: 'dog',
    breed: 'Ratterian',
    age: '7 months old',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_b93e6d53da344f97bac5177c4109964f~mv2.jpeg',
    health: ['Spayed', 'Heartworm Negative', '3-Year Rabies Vaccine', '3 sets of vaccines (DHPP/Bordetella)', 'Microchipped'],
  },
  {
    id: 'levo',
    name: 'Levo',
    type: 'dog',
    age: '4 years old',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_565016fa74f341b3aba3c02a563a85ac~mv2.jpg',
    health: ['Heartworm Positive (treatment provided)', 'Sweet and loving personality', 'Needs quiet foster home', 'Perfect companion once healthy'],
    fosterNote: 'Foster-to-Adopt: Due to heartworm positive status, Levo needs a loving foster home during treatment. We\'ll provide all medical care!',
    buttonText: 'Apply to Foster',
  },
  {
    id: 'rolo',
    name: 'Rolo',
    type: 'dog',
    age: '1 year old',
    weight: '11 lbs',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_77899efe530d47e383407f1def488a72~mv2.jpeg',
    health: ['Heartworm Negative', 'Pad trained', 'Up to date on vaccines', 'Perfect for apartment living'],
    specialNote: 'Very shy - needs patient family',
  },
  {
    id: 'priya',
    name: 'Priya',
    type: 'dog',
    breed: 'Chihuahua Mix',
    age: '3 weeks old',
    gender: 'Female',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_2017774f67df49799ebfacee7873dad5~mv2.jpeg',
    health: ['Currently being bottle fed', 'Will be spayed when age appropriate', 'Will receive full vaccination series', 'Available in 6-8 weeks'],
    specialNote: 'Too young for adoption - available for reservation',
    buttonText: 'Reserve Priya',
  },
  {
    id: 'milo',
    name: 'Milo',
    type: 'dog',
    age: '1 year old',
    weight: '11 lbs',
    gender: 'Male',
    price: 250,
    imageUrl: 'https://static.wixstatic.com/media/33e096_527596d0a9314e6696e93cb2e924b24c~mv2.jpeg',
    health: ['Heartworm Negative', 'Pad trained', 'Up to date on vaccines', 'Perfect for apartment living'],
    specialNote: 'Very shy - needs patient family',
  },
  // CATS
  {
    id: 'gouda',
    name: 'Gouda',
    type: 'cat',
    age: '4 months old',
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_cc2d7ffdeee44a549eb1a8499900701f~mv2.jpeg',
    health: ['Spayed', 'Rabies Vaccine', 'FVRCP Vaccine', 'Combo tested', 'Wormed'],
  },
  {
    id: 'roxie',
    name: 'Roxie',
    type: 'cat',
    breed: 'Grey Tabby',
    age: '6 weeks old',
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_8fdfd556a1cf4934a8d35d2c2548907d~mv2.jpg',
    health: ['Will be spayed when age appropriate', 'First vaccines received', 'Needs experienced kitten family', 'Available for reservation'],
    specialNote: 'Vetting currently in process',
    buttonText: 'Reserve Roxie',
  },
  {
    id: 'cheddar',
    name: 'Cheddar',
    type: 'cat',
    age: '4 months old',
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_cc2d7ffdeee44a549eb1a8499900701f~mv2.jpeg',
    health: ['Neutered', 'Rabies Vaccine', 'FVRCP Vaccine', 'Combo tested', 'Wormed'],
  },
  {
    id: 'fia',
    name: 'Fia',
    type: 'cat',
    age: '1 year old',
    gender: 'Female',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_83be9144080048929bd7f29773772361~mv2.jpeg',
    health: ['Fully Vetted', 'Spayed', 'Up to date on all vaccines', 'Microchipped'],
  },
  {
    id: 'boo',
    name: 'Boo',
    type: 'cat',
    age: '4 months old',
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_ce95191b903940bfa39b4facede27d07~mv2.jpeg',
    health: ['Neutered', 'Age-appropriate vaccines', 'Beautiful brown tabby markings', 'Playful kitten personality'],
  },
  {
    id: 'pepperjack',
    name: 'Pepper Jack',
    type: 'cat',
    age: '4 months old',
    gender: 'Male',
    price: 150,
    imageUrl: 'https://static.wixstatic.com/media/33e096_5286b3144fec4221ace60624db8035ff~mv2.jpeg',
    health: ['Neutered', 'Rabies Vaccine', 'FVRCP Vaccine', 'Combo tested', 'Wormed'],
  },
]

export default function AdoptPage() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs')

  const dogs = animals.filter((a) => a.type === 'dog')
  const cats = animals.filter((a) => a.type === 'cat')
  const displayAnimals = activeTab === 'dogs' ? dogs : cats

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayAnimals.map((animal) => (
              <div
                key={animal.id}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-green-600"
              >
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 bg-gray-100">
                  <Image
                    src={animal.imageUrl}
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
                  {animal.age} • {animal.gender}
                  {animal.weight && ` • ${animal.weight}`}
                </p>

                <div className="text-3xl font-bold text-green-600 mb-4">
                  ${animal.price}
                </div>

                {animal.specialNote && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800 font-medium">
                    {animal.specialNote}
                  </div>
                )}

                {animal.fosterNote && (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-gray-800 font-medium">
                    {animal.fosterNote}
                  </div>
                )}

                <div className="mb-5">
                  <h4 className="font-semibold mb-2 text-sm">Health & Care:</h4>
                  <ul className="space-y-1">
                    {animal.health.map((item, idx) => (
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
                  {animal.buttonText || 'Apply to Adopt'}
                </AdoptionButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <DonateSection />
    </>
  )
}
