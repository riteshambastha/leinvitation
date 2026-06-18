import { createServerSupabaseClient } from '@/lib/supabase-server'
import RSVPClient from './RSVPClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, host_name, date, time, venue, cover_emoji')
    .eq('id', params.id)
    .single()

  if (!event) return {}

  const date = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
  const description = `${date} at ${event.time} · ${event.venue} · Hosted by ${event.host_name}`
  const title = `${event.cover_emoji} You're invited to ${event.title}!`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

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
