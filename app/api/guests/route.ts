import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

// POST — add a guest manually (from dashboard)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      event_id, name, email,
      phone, rsvp_status, adult_count, kids_count,
    } = body

    if (!event_id || !name || !email) {
      return NextResponse.json({ error: 'event_id, name, and email are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verify event exists
    const { error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .single()

    if (eventError) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const ac = adult_count ?? 1
    const kc = kids_count  ?? 0

    const { data: guest, error } = await supabase
      .from('guests')
      .insert({
        event_id,
        name,
        email,
        phone:         phone        || null,
        rsvp_status:   rsvp_status  ?? 'attending',
        adult_count:   ac,
        kids_count:    kc,
        plus_one_count: Math.max(0, (ac - 1) + kc),
        rsvped_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A guest with this email already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json(guest)
  } catch (err: unknown) {
    console.error('POST /api/guests error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
