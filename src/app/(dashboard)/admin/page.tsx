import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Image as ImageIcon, Settings, Users } from 'lucide-react'

export default async function AdminPage() {
  // Check if Supabase is configured
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let userCount = 0
  let conversationCount = 0
  let postCount = 0
  let recentSubmissions: any[] = []

  if (hasSupabase) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      redirect('/dashboard')
    }

    // Get stats
    const { count: users } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: conversations } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    const { count: posts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    const { data: submissions } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    userCount = users || 0
    conversationCount = conversations || 0
    postCount = posts || 0
    recentSubmissions = submissions || []
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/animals"
            className="group rounded-lg border-2 border-blue-200 bg-blue-50 p-6 hover:border-blue-400 hover:bg-blue-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600 p-3">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Manage Animals</h3>
                <p className="text-sm text-blue-700">Upload photos & manage listings</p>
              </div>
            </div>
          </Link>

          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-400 p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-400 p-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Statistics</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">{userCount || 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Conversations</h3>
          <p className="mt-2 text-3xl font-bold">{conversationCount || 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Community Posts</h3>
          <p className="mt-2 text-3xl font-bold">{postCount || 0}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Recent Contact Submissions</h2>
        <div className="mt-4 space-y-4">
          {recentSubmissions?.map((submission) => (
            <div key={submission.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{submission.name}</p>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                  {submission.company && (
                    <p className="text-sm text-muted-foreground">{submission.company}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    submission.status === 'new'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : submission.status === 'read'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {submission.status}
                </span>
              </div>
              <p className="mt-2 text-sm">{submission.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

