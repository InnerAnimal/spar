'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Conversation, Message } from '@/types'

export default function ChatPage() {
  const [model, setModel] = useState<'gpt-4' | 'claude-3'>('gpt-4')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setConversations(data)
  }

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  const createConversation = async () => {
    const { data: conversation } = await supabase
      .from('conversations')
      .insert({
        model,
        title: 'New Conversation',
      })
      .select()
      .single()

    if (conversation) {
      setConversations([conversation, ...conversations])
      setSelectedConversation(conversation.id)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return

    const userMessage = input
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          role: 'user',
          content: userMessage,
          model,
        }),
      })

      const data = await response.json()
      if (data.userMessage && data.aiMessage) {
        setMessages([...messages, data.userMessage, data.aiMessage])
      }
      loadConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Conversations</h2>
          <button
            onClick={createConversation}
            className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
          >
            New
          </button>
        </div>
        <div className="mb-4">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'gpt-4' | 'claude-3')}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent ${
                selectedConversation === conv.id ? 'bg-accent' : ''
              }`}
            >
              {conv.title || 'Untitled'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Start a conversation
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 rounded-md border border-border bg-background px-4 py-2"
              disabled={!selectedConversation || loading}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedConversation || loading || !input.trim()}
              className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

