import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { tnrRequestSchema } from '../../../../lib/validation/tnr-request'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the form data
    const validatedData = tnrRequestSchema.parse(body)

    // Transform camelCase data to snake_case for database insertion
    const dbData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      address: validatedData.address,
      address2: validatedData.address2,
      city: validatedData.city,
      state: validatedData.state,
      zip_code: validatedData.zipCode,
      phone: validatedData.phone,
      email: validatedData.email,
      how_many_cats: validatedData.howManyCats,
      any_injured_or_sick: validatedData.anyInjuredOrSick,
      how_long_had_them: validatedData.howLongHadThem,
      are_they_fixed: validatedData.areTheyFixed,
      additional_information: validatedData.additionalInformation,
    }

    // Save to database using Supabase
    const { data: submission, error } = await supabase
      .from('tnr_requests')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      throw new Error('Failed to save TNR request')
    }

    // TODO: Send email notifications here
    // await sendTNRConfirmationEmail(submission)
    // await sendTNRNotificationEmail(submission)

    return NextResponse.json(
      {
        success: true,
        message: 'TNR request submitted successfully',
        id: submission.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    console.error('TNR Request Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
