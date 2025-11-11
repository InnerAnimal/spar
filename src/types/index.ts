export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  company: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  model: 'gpt-4' | 'claude-3'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  parent_id: string | null
  title: string | null
  content: string
  likes: number
  created_at: string
  updated_at: string
}

export interface VideoRoom {
  id: string
  host_id: string
  room_name: string
  is_active: boolean
  max_participants: number
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_name: string | null
  status: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  status: 'new' | 'read' | 'responded'
  created_at: string
}

