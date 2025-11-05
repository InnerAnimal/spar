import { NextRequest, NextResponse } from 'next/server'
import { chatWithClaude } from '@/lib/ai/anthropic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const response = await chatWithClaude(messages)

    return NextResponse.json({ content: response })
  } catch (error) {
    console.error('Anthropic API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

