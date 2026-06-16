import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Logged-in users go straight to their invites
  if (user) redirect('/my-invites')

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Birthday invites,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            completely free.
          </span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-lg">
          Create beautiful invitations, share a link, collect RSVPs, and manage your guest list — no subscriptions, ever.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="btn-primary text-lg px-8 py-4">
            Get started free →
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-4">
            Log in
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full text-left">
          {[
            { emoji: '✉️', title: 'Email invites', desc: 'Send personalized invites directly to each guest\'s inbox.' },
            { emoji: '✅', title: 'RSVP tracking', desc: 'Guests RSVP with one click — you see live updates.' },
            { emoji: '📋', title: 'Guest list', desc: 'See who\'s coming, who hasn\'t replied, and send reminders.' },
          ].map(f => (
            <div key={f.title} className="card">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
