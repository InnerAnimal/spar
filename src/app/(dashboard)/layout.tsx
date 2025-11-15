import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/layout/logout-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          {profile?.role === 'admin' && (
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
          <div className="pt-4 border-t border-border mt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}

