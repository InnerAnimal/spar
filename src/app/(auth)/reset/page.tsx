'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`,
      })

      if (error) throw error

      setMessage('Check your email for the password reset link')
    } catch (err: any) {
      setMessage(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        <form onSubmit={handleReset} className="mt-8 space-y-6">
          {message && (
            <div className="rounded-md bg-muted p-3 text-sm">{message}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
          <div className="text-center text-sm">
            <a href="/login" className="text-primary hover:underline">
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

