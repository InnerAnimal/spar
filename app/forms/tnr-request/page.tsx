'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import type { TNRRequestData } from '../../../lib/validation/tnr-request'

export default function TNRRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<TNRRequestData>>({})
  const [errors, setErrors] = useState<Partial<Record<keyof TNRRequestData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setErrors({})

    try {
      const response = await fetch('/api/forms/tnr-request', {
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

      // Success - redirect to thank you page
      router.push('/forms/thank-you')
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              TNR Assistance Request
            </h1>
            <p className="text-gray-600">
              Request Trap-Neuter-Return services for community cats in your
              area. All fields marked with * are required.
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
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

            {/* Address */}
            <div className="space-y-4">
              <Input
                label="Street Address"
                name="address"
                required
                value={formData.address || ''}
                onChange={handleChange}
                error={errors.address}
              />
              <Input
                label="Street Address Line 2"
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
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="(000) 000-0000"
                required
                value={formData.phone || ''}
                onChange={handleChange}
                error={errors.phone}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="example@example.com"
                required
                value={formData.email || ''}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Cat Questions */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-xl font-semibold text-gray-900">
                About the Cats
              </h3>

              <Input
                label="How many cats do you have?"
                name="howManyCats"
                required
                value={formData.howManyCats || ''}
                onChange={handleChange}
                error={errors.howManyCats}
              />

              <Input
                label="Any injured or sick?"
                name="anyInjuredOrSick"
                required
                value={formData.anyInjuredOrSick || ''}
                onChange={handleChange}
                error={errors.anyInjuredOrSick}
              />

              <Input
                label="How long have you had them?"
                name="howLongHadThem"
                value={formData.howLongHadThem || ''}
                onChange={handleChange}
              />

              <Input
                label="Are they fixed?"
                name="areTheyFixed"
                value={formData.areTheyFixed || ''}
                onChange={handleChange}
              />

              <Textarea
                label="Anything else you think I should know about your situation?"
                name="additionalInformation"
                value={formData.additionalInformation || ''}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto md:min-w-[200px]"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
