import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Welcome back!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.full_name || user.email}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">AI Conversations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start chatting with AI assistants
          </p>
          <a
            href="/app/chat"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Chat
          </a>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold">Community</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Join discussions and share ideas
          </p>
          <a
            href="/app/community"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Visit Community
          </a>
        </div>
      </div>
    </div>
  )
}

