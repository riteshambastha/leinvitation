import { createServerSupabaseClient } from '@/lib/supabase-server'
import RSVPClient from './RSVPClient'
import { notFound } from 'next/navigation'

export default async function InvitePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) notFound()

  return <RSVPClient event={event} />
}
