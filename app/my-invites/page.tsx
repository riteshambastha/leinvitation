import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { format, parseISO } from 'date-fns'

export default async function MyInvitesPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select('*, guests(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userEmail={user.email} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Invites</h1>
            <p className="text-gray-500 mt-1">
              {events?.length === 0 ? 'No invites yet' : `${events?.length} invite${events?.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link href="/create" className="btn-primary">
            + New invite
          </Link>
        </div>

        {events?.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🎂</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No invites yet</h2>
            <p className="text-gray-500 mb-6">Create your first birthday invitation — it takes 2 minutes</p>
            <Link href="/create" className="btn-primary">
              Create my first invite →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events?.map(event => {
              const guestCount = (event.guests as { count: number }[])?.[0]?.count ?? 0
              const eventDate = parseISO(event.date)
              const isPast = eventDate < new Date()

              return (
                <div key={event.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <span className="text-4xl">{event.cover_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-gray-900 text-lg">{event.title}</h2>
                          {isPast && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Past</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {format(eventDate, 'MMMM d, yyyy')} · {event.time} · {event.venue}
                        </p>
                        <p className="text-purple-600 text-sm font-semibold mt-1">
                          {guestCount} RSVP{guestCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/invite/${event.id}`}
                        target="_blank"
                        className="btn-secondary text-xs py-1.5 px-3">
                        🔗 Invite link
                      </Link>
                      <Link
                        href={`/dashboard/${event.id}?token=${event.dashboard_token}`}
                        className="btn-primary text-xs py-1.5 px-3">
                        Dashboard →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
