'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types'

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles:user_id(full_name, email)')
      .is('parent_id', null)
      .order('created_at', { ascending: false })
    if (data) setPosts(data as any)
  }

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await supabase
      .from('posts')
      .insert({
        title,
        content,
      })
      .select()
      .single()

    if (data) {
      setPosts([data, ...posts])
      setTitle('')
      setContent('')
      setShowForm(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createPost} className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Post
          </button>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-xl font-semibold">{post.title || 'Untitled'}</h3>
            <p className="mt-2 text-muted-foreground">{post.content}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {post.profiles?.full_name || post.profiles?.email || 'Unknown'}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

