'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-muted-foreground hover:text-foreground"
    >
      Logout
    </button>
  )
}

