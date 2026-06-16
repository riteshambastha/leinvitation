import { NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase-server'
import { sendHostConfirmationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      host_name, host_email, title, date, time, venue, venue_address,
      description, theme, template_id, cover_emoji, plus_ones_allowed, message_prompt,
    } = body

    if (!host_name || !host_email || !title || !date || !time || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the authenticated user (if any) to link the event
    const serverClient = createServerSupabaseClient()
    const { data: { user } } = await serverClient.auth.getUser()

    const supabase = createAdminClient()
    const resolvedTemplate = template_id ?? theme ?? 'birthday'
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        host_name, host_email, title, date, time, venue, venue_address,
        description, theme: resolvedTemplate, template_id: resolvedTemplate,
        cover_emoji: cover_emoji ?? '🎂',
        plus_ones_allowed: plus_ones_allowed ?? true, message_prompt,
        user_id: user?.id ?? null,
      })
      .select()
      .single()

    if (error) throw error

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const dashboardUrl = `${appUrl}/dashboard/${event.id}?token=${event.dashboard_token}`

    // Send host confirmation (non-blocking — don't fail if email fails)
    sendHostConfirmationEmail({ event, dashboardUrl }).catch(console.error)

    return NextResponse.json(event)
  } catch (err: unknown) {
    console.error('POST /api/events error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
