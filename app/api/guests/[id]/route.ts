import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { name, email, phone, rsvp_status, adult_count, kids_count } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }

    const ac = adult_count ?? 1
    const kc = kids_count  ?? 0

    const supabase = createAdminClient()
    const { data: guest, error } = await supabase
      .from('guests')
      .update({
        name,
        email,
        phone:          phone || null,
        rsvp_status:    rsvp_status ?? 'attending',
        adult_count:    ac,
        kids_count:     kc,
        plus_one_count: Math.max(0, (ac - 1) + kc),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(guest)
  } catch (err: unknown) {
    console.error('PATCH /api/guests/[id] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
