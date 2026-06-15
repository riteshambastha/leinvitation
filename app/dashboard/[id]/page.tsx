import { createServerSupabaseClient } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'
import { notFound, redirect } from 'next/navigation'

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { token?: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) notFound()

  // Validate dashboard token
  if (!searchParams.token || searchParams.token !== event.dashboard_token) {
    redirect('/?error=unauthorized')
  }

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', params.id)
    .order('rsvped_at', { ascending: false })

  return <DashboardClient event={event} initialGuests={guests ?? []} />
}
