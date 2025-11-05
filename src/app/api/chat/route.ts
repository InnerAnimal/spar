import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, role, content, model } = body

    if (!conversationId || !role || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify conversation belongs to user
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id, user_id')
      .eq('id', conversationId)
      .single()

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving message:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Get AI response
    const apiEndpoint = model === 'gpt-4' ? '/api/openai' : '/api/anthropic'
    const aiResponse = await fetch(`${request.nextUrl.origin}${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...(await supabase
            .from('messages')
            .select('role, content')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .then((res) => res.data || [])),
        ],
      }),
    })

    const aiData = await aiResponse.json()
    const aiContent = aiData.content || ''

    // Save AI response
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiContent,
      })
      .select()
      .single()

    return NextResponse.json({
      userMessage: message,
      aiMessage: aiMessage,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

