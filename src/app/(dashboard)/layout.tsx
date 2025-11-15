import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/layout/logout-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if Supabase is configured
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let user = null
  let profile = null

  if (hasSupabase) {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (!user) {
      redirect('/login')
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    profile = profileData
  }

  // For now, show admin links if no auth is configured (development mode)
  const showAdminLinks = !hasSupabase || profile?.role === 'admin'

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold hover:text-primary">
            InnerAnimalMedia
          </Link>
        </div>
        <nav className="space-y-1 px-4">
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            AI Chat
          </Link>
          <Link
            href="/community"
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Community
          </Link>
          <Link
            href="/video"
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Video Calls
          </Link>
          {showAdminLinks && (
            <>
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Admin
              </Link>
              <Link
                href="/admin/animals"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Manage Animals
              </Link>
            </>
          )}
          {hasSupabase && (
            <div className="pt-4 border-t border-border mt-4">
              <LogoutButton />
            </div>
          )}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}

