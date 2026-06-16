import { createServerSupabaseClient } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'
import Nav from '@/components/Nav'
import { notFound, redirect } from 'next/navigation'

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const supabase = createServerSupabaseClient()

  const [{ data: { user } }, { data: event, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('events').select('*').eq('id', params.id).single(),
  ])

  if (error || !event) notFound()

  // Allow access if: valid token OR logged-in owner
  const validToken = searchParams.token && searchParams.token === event.dashboard_token
  const isOwner = user && user.id === event.user_id

  if (!validToken && !isOwner) {
    redirect('/?error=unauthorized')
  }

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', params.id)
    .order('rsvped_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userEmail={user?.email} />
      <DashboardClient event={event} initialGuests={guests ?? []} />
    </div>
  )
}
