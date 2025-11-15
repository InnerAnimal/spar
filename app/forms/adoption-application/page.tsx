'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'

type AdoptionFormData = {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  address2?: string
  city: string
  state: string
  zipCode: string

  // Animal Interest
  animalName?: string
  animalType: string

  // Housing
  housingType: string
  ownOrRent: string
  landlordName?: string
  landlordPhone?: string

  // Household
  numberOfAdults: string
  numberOfChildren: string
  childrenAges?: string
  allAgreeable: string

  // Pet Experience
  currentPets: string
  currentPetsDetails?: string
  previousPets: string
  previousPetsDetails?: string
  veterinarianName?: string
  veterinarianPhone?: string

  // Additional Information
  whyAdopting: string
  previousSurrender: string
  previousSurrenderDetails?: string
  additionalInfo?: string
}

export default function AdoptionApplicationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<AdoptionFormData>>({
    animalType: 'dog'
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AdoptionFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setErrors({})

    try {
      const response = await fetch('/api/forms/adoption-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setSubmitError(data.message || 'Something went wrong')
        }
        return
      }

      router.push('/forms/thank-you')
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Adoption Application
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in adopting! Please fill out this application completely.
              All fields marked with * are required.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Submitting this application does not guarantee adoption.
                We will review your application and contact you within 2-3 business days.
              </p>
            </div>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  required
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  required
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              <Input
                label="Street Address"
                name="address"
                required
                value={formData.address || ''}
                onChange={handleChange}
                error={errors.address}
              />

              <Input
                label="Apartment, suite, etc. (optional)"
                name="address2"
                value={formData.address2 || ''}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  required
                  value={formData.city || ''}
                  onChange={handleChange}
                  error={errors.city}
                />
                <Input
                  label="State"
                  name="state"
                  required
                  value={formData.state || ''}
                  onChange={handleChange}
                  error={errors.state}
                />
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  required
                  value={formData.zipCode || ''}
                  onChange={handleChange}
                  error={errors.zipCode}
                />
              </div>
            </section>

            {/* Animal Interest */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Animal of Interest
              </h2>

              <Input
                label="Animal Name (if specific)"
                name="animalName"
                placeholder="e.g., Blue, Mabel, or leave blank if undecided"
                value={formData.animalName || ''}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type *
                </label>
                <select
                  name="animalType"
                  required
                  value={formData.animalType || 'dog'}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="either">Either Dog or Cat</option>
                </select>
              </div>
            </section>

            {/* Housing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Housing Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Housing *
                </label>
                <select
                  name="housingType"
                  required
                  value={formData.housingType || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="mobile">Mobile Home</option>
                  <option value="other">Other</option>
                </select>
                {errors.housingType && (
                  <p className="mt-1 text-sm text-red-600">{errors.housingType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you own or rent? *
                </label>
                <select
                  name="ownOrRent"
                  required
                  value={formData.ownOrRent || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="own">Own</option>
                  <option value="rent">Rent</option>
                </select>
                {errors.ownOrRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.ownOrRent}</p>
                )}
              </div>

              {formData.ownOrRent === 'rent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-4 border-blue-200">
                  <Input
                    label="Landlord Name"
                    name="landlordName"
                    value={formData.landlordName || ''}
                    onChange={handleChange}
                  />
                  <Input
                    label="Landlord Phone"
                    name="landlordPhone"
                    type="tel"
                    value={formData.landlordPhone || ''}
                    onChange={handleChange}
                  />
                </div>
              )}
            </section>

            {/* Household */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Household Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Number of Adults (18+)"
                  name="numberOfAdults"
                  type="number"
                  required
                  value={formData.numberOfAdults || ''}
                  onChange={handleChange}
                  error={errors.numberOfAdults}
                />
                <Input
                  label="Number of Children (under 18)"
                  name="numberOfChildren"
                  type="number"
                  required
                  value={formData.numberOfChildren || ''}
                  onChange={handleChange}
                  error={errors.numberOfChildren}
                />
              </div>

              {formData.numberOfChildren && parseInt(formData.numberOfChildren) > 0 && (
                <Input
                  label="Ages of Children"
                  name="childrenAges"
                  placeholder="e.g., 5, 8, 12"
                  value={formData.childrenAges || ''}
                  onChange={handleChange}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Does everyone in the household agree to this adoption? *
                </label>
                <select
                  name="allAgreeable"
                  required
                  value={formData.allAgreeable || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.allAgreeable && (
                  <p className="mt-1 text-sm text-red-600">{errors.allAgreeable}</p>
                )}
              </div>
            </section>

            {/* Pet Experience */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Pet Experience
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you currently have any pets? *
                </label>
                <select
                  name="currentPets"
                  required
                  value={formData.currentPets || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.currentPets && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPets}</p>
                )}
              </div>

              {formData.currentPets === 'yes' && (
                <Textarea
                  label="Please describe your current pets (type, age, spayed/neutered)"
                  name="currentPetsDetails"
                  value={formData.currentPetsDetails || ''}
                  onChange={handleChange}
                />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you had pets in the past? *
                </label>
                <select
                  name="previousPets"
                  required
                  value={formData.previousPets || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.previousPets && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousPets}</p>
                )}
              </div>

              {formData.previousPets === 'yes' && (
                <Textarea
                  label="Please describe your previous pets and what happened to them"
                  name="previousPetsDetails"
                  value={formData.previousPetsDetails || ''}
                  onChange={handleChange}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Current Veterinarian Name"
                  name="veterinarianName"
                  value={formData.veterinarianName || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Veterinarian Phone"
                  name="veterinarianPhone"
                  type="tel"
                  value={formData.veterinarianPhone || ''}
                  onChange={handleChange}
                />
              </div>
            </section>

            {/* Additional Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                Additional Information
              </h2>

              <Textarea
                label="Why do you want to adopt this pet? *"
                name="whyAdopting"
                required
                value={formData.whyAdopting || ''}
                onChange={handleChange}
                error={errors.whyAdopting}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you ever had to surrender a pet? *
                </label>
                <select
                  name="previousSurrender"
                  required
                  value={formData.previousSurrender || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.previousSurrender && (
                  <p className="mt-1 text-sm text-red-600">{errors.previousSurrender}</p>
                )}
              </div>

              {formData.previousSurrender === 'yes' && (
                <Textarea
                  label="Please explain the circumstances"
                  name="previousSurrenderDetails"
                  value={formData.previousSurrenderDetails || ''}
                  onChange={handleChange}
                />
              )}

              <Textarea
                label="Is there anything else you&apos;d like us to know?"
                name="additionalInfo"
                value={formData.additionalInfo || ''}
                onChange={handleChange}
              />
            </section>

            {/* Agreement */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                By submitting this application, I certify that all information provided is true and complete.
                I understand that Southern Pets Animal Rescue reserves the right to deny any application and
                that submitting an application does not guarantee approval. I agree to a home visit if requested
                and understand that adoption fees are non-refundable.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 md:flex-initial md:min-w-[200px]"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="md:min-w-[120px]"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
