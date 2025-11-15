import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Basic validation
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'animalType',
      'housingType',
      'ownOrRent',
      'numberOfAdults',
      'numberOfChildren',
      'allAgreeable',
      'currentPets',
      'previousPets',
      'whyAdopting',
      'previousSurrender',
    ]

    const errors: Record<string, string> = {}

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = 'This field is required'
      }
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // TODO: In the future, save this to a database or send via email
    // For now, just log it (in production, you'd want to store this properly)
    console.log('Adoption Application Received:', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      animalName: formData.animalName || 'Not specified',
      animalType: formData.animalType,
      submittedAt: new Date().toISOString(),
    })

    // In a real app, you would:
    // 1. Save to database
    // 2. Send confirmation email to applicant
    // 3. Send notification email to rescue organization
    // 4. Possibly integrate with a CRM system

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
    })
  } catch (error) {
    console.error('Error processing adoption application:', error)
    return NextResponse.json(
      { message: 'Failed to submit application. Please try again.' },
      { status: 500 }
    )
  }
}
