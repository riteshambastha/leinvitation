import { NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { token, ...fields } = body

    // Load the event to verify auth
    const admin = createAdminClient()
    const { data: event, error: fetchError } = await admin
      .from('events')
      .select('id, dashboard_token, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Auth check: valid dashboard token OR logged-in owner
    const serverClient = createServerSupabaseClient()
    const { data: { user } } = await serverClient.auth.getUser()
    const validToken = token && token === event.dashboard_token
    const isOwner = user && user.id === event.user_id

    if (!validToken && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Only allow updating safe fields
    const allowed = [
      'title', 'date', 'time', 'venue', 'venue_address', 'description',
      'cover_emoji', 'plus_ones_allowed', 'message_prompt',
      'template_id', 'theme', 'banner_id', 'banner_url', 'child_photo_url',
    ]
    const update: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in fields) update[key] = fields[key] ?? null
    }
    // Keep template_id and theme in sync
    if (update.template_id) update.theme = update.template_id
    if (update.theme && !update.template_id) update.template_id = update.theme

    const { data: updated, error: updateError } = await admin
      .from('events')
      .update(update)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) throw updateError
    return NextResponse.json(updated)
  } catch (err: unknown) {
    console.error('PATCH /api/events/[id] error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
