import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { sendRsvpNotification } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { event_id, name, email, phone, rsvp_status, adult_count, kids_count, message } = body
    const ac = Math.max(1, parseInt(adult_count) || 1)
    const kc = Math.max(0, parseInt(kids_count)  || 0)
    const plus_one_count = (ac - 1) + kc  // legacy total extras

    if (!event_id || !name || !email || !rsvp_status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['attending', 'not_attending', 'maybe'].includes(rsvp_status)) {
      return NextResponse.json({ error: 'Invalid rsvp_status' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get the event for notifications
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Upsert guest — handles re-RSVP by same email
    const { data: guest, error } = await supabase
      .from('guests')
      .upsert(
        {
          event_id,
          name,
          email,
          phone: phone ?? null,
          rsvp_status,
          adult_count: ac,
          kids_count: kc,
          plus_one_count,
          message: message ?? null,
          rsvped_at: new Date().toISOString(),
        },
        { onConflict: 'event_id,email' }
      )
      .select()
      .single()

    if (error) throw error

    // Notify host (non-blocking)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const dashboardUrl = `${appUrl}/dashboard/${event.id}?token=${event.dashboard_token}`
    sendRsvpNotification({
      event,
      guestName: name,
      rsvpStatus: rsvp_status,
      plusOnes: plus_one_count,
      message,
      dashboardUrl,
    }).catch(console.error)

    return NextResponse.json(guest)
  } catch (err: unknown) {
    console.error('POST /api/rsvp error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
