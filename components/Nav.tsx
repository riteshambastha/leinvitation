'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Nav({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href={userEmail ? '/my-invites' : '/'} className="text-xl font-bold text-purple-700">
          🎂 BdayInvite
        </Link>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <Link href="/my-invites" className="text-sm text-gray-600 hover:text-purple-600 font-medium">
                My Invites
              </Link>
              <Link href="/create" className="btn-primary text-sm py-2 px-4">
                + New invite
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500 hidden sm:block">{userEmail}</span>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 font-medium">
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-purple-600 font-medium">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
