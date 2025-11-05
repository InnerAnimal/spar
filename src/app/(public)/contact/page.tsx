'use client'

import { useState } from 'react'
import { PublicLayout } from '@/components/layout/public-layout'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      setSubmitted(true)
      setFormData({ name: '', email: '', company: '', message: '' })
    }
  }

  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have a question or want to work with us? Get in touch!
          </p>
          {submitted ? (
            <div className="mt-8 rounded-lg border border-green-500 bg-green-50 p-6 dark:bg-green-950">
              <p className="text-green-800 dark:text-green-200">
                Thank you for your message! We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

