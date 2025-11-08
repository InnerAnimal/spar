import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { tnrRequestSchema } from '@/lib/validation/tnr-request'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the form data
    const validatedData = tnrRequestSchema.parse(body)

    // Save to database using Supabase
    const { data: submission, error } = await supabase
      .from('tnr_requests')
      .insert([validatedData])
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
      error.errors.forEach((err) => {
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
