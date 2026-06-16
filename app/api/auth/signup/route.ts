import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Create user with no email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,           // skip verification
      user_metadata: { name },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ id: data.user.id })
  } catch (err: unknown) {
    console.error('POST /api/auth/signup error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
