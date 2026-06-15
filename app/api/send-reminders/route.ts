import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendReminderEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { event_id, guest_ids } = await req.json()

    if (!event_id || !Array.isArray(guest_ids) || guest_ids.length === 0) {
      return NextResponse.json({ error: 'event_id and guest_ids[] are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const { data: guests, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', event_id)
      .in('id', guest_ids)

    if (guestError) throw guestError

    const results = await Promise.allSettled(
      (guests ?? []).map(guest =>
        sendReminderEmail({ event, guestName: guest.name, guestEmail: guest.email })
      )
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({ sent, failed })
  } catch (err: unknown) {
    console.error('POST /api/send-reminders error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
