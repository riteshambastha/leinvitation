import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export default async function OgImage({ params }: { params: { id: string } }) {
  const supabase = getSupabase()
  const { data: event } = await supabase
    .from('events')
    .select('title, host_name, date, time, venue, venue_address, cover_emoji, child_photo_url')
    .eq('id', params.id)
    .single()

  if (!event) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, background: 'linear-gradient(135deg,#7c3aed,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'white', fontSize: 48 }}>Le` Invitation</span>
      </div>,
      { ...size }
    )
  }

  const date = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Gradient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, #4c1d95 0%, #7c3aed 35%, #db2777 75%, #be185d 100%)',
          display: 'flex',
        }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '60px 80px',
          gap: 0,
        }}>

          {/* Child photo or emoji */}
          {event.child_photo_url ? (
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              border: '5px solid rgba(255,255,255,0.9)',
              overflow: 'hidden', marginBottom: 28,
              display: 'flex',
              boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.child_photo_url} width={140} height={140}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }} alt="" />
            </div>
          ) : (
            <div style={{ fontSize: 96, marginBottom: 16, display: 'flex' }}>
              {event.cover_emoji}
            </div>
          )}

          {/* "You're invited to" label */}
          <div style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
            display: 'flex',
          }}>
            YOU&apos;RE INVITED TO
          </div>

          {/* Event title */}
          <div style={{
            color: 'white',
            fontSize: event.title.length > 30 ? 52 : 64,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 32,
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            maxWidth: 900,
          }}>
            {event.title}
          </div>

          {/* Details pill */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 16,
            padding: '20px 36px',
            display: 'flex',
            gap: 32,
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'flex' }}>📅</span>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 600, display: 'flex' }}>{date}</span>
            </div>
            <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.25)', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'flex' }}>⏰</span>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 600, display: 'flex' }}>{event.time}</span>
            </div>
            <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.25)', display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'flex' }}>📍</span>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 600, display: 'flex' }}>{event.venue}</span>
            </div>
          </div>

          {/* Hosted by */}
          <div style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            marginTop: 24,
            display: 'flex',
          }}>
            Hosted by {event.host_name}
          </div>
        </div>

        {/* Bottom branding strip */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.2)',
          padding: '12px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 600, display: 'flex' }}>
            Le` Invitation
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, display: 'flex' }}>
            leinvitation.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
