import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Nav from '@/components/Nav'
import EditClient from './EditClient'

export default async function EditPage({
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

  const validToken = searchParams.token && searchParams.token === event.dashboard_token
  const isOwner = user && user.id === event.user_id

  if (!validToken && !isOwner) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userEmail={user?.email} />
      <EditClient event={event} token={searchParams.token ?? null} />
    </div>
  )
}
