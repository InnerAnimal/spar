import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/app/dashboard')
  }

  // Get stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: conversationCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })

  const { count: postCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { data: recentSubmissions } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
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

