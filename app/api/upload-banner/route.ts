import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

const BUCKET = 'banners'
const MAX_BYTES = 5 * 1024 * 1024  // 5 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Must be an image' }, { status: 400 })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = createAdminClient()
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return NextResponse.json({ url: publicUrl })
  } catch (err: unknown) {
    console.error('upload-banner error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 },
    )
  }
}
