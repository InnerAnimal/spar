'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAnimalSimple() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addSampleAnimals = async () => {
    setLoading(true)
    setError(null)

    const sampleAnimals = [
      {
        name: 'Blue',
        type: 'dog',
        breed: 'Pitbull',
        age: 1,
        gender: 'Male',
        price: 250,
        status: 'available',
        spayedNeutered: true,
        vaccinated: true,
        microchipped: true,
        heartwormStatus: 'Negative',
        healthNotes: 'Neutered, Heartworm Negative, 3-Year Rabies Vaccine, 3 sets of vaccines (DHPP/Bordetella), Microchipped',
      },
      {
        name: 'Mabel',
        type: 'dog',
        breed: 'Hound Mix',
        age: 2,
        gender: 'Female',
        price: 250,
        status: 'available',
        spayedNeutered: true,
        vaccinated: true,
        microchipped: true,
        healthNotes: 'Spayed, 3-Year Rabies Vaccine, DHPP and Bordetella Vaccines, Microchipped',
        specialNote: 'Heartworm treatment in progress',
      },
      {
        name: 'Gouda',
        type: 'cat',
        age: 0,
        gender: 'Female',
        price: 150,
        status: 'available',
        spayedNeutered: true,
        vaccinated: true,
        healthNotes: 'Spayed, Rabies Vaccine, FVRCP Vaccine, Combo tested, Wormed',
      },
    ]

    try {
      for (const animal of sampleAnimals) {
        const response = await fetch('/api/animals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(animal),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to add animal')
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/animals')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add animals')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Add Sample Animals
        </h1>

        <p className="text-gray-600 mb-6 text-center text-sm">
          This will add 3 sample animals to your database so you can test photo uploads.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm font-medium">
              ✅ Success! Added 3 animals. Redirecting...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={addSampleAnimals}
            disabled={loading || success}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding Animals...' : success ? 'Done!' : 'Add 3 Sample Animals'}
          </button>

          <a
            href="/admin/animals"
            className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go to Animal List
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Sample animals:
            <br />
            • Blue (Dog, Pitbull)
            <br />
            • Mabel (Dog, Hound Mix)
            <br />
            • Gouda (Cat)
          </p>
        </div>
      </div>
    </div>
  )
}
