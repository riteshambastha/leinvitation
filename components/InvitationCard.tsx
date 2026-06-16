'use client'

import type { Event } from '@/lib/types'
import { getTemplate } from '@/lib/templates'
import { getBanner } from '@/lib/banners'
import { format, parseISO } from 'date-fns'

// ── Photo style maps ────────────────────────────────────────────────────────
const PHOTO_SIZES = {
  sm: { outer: 100, inner: 88 },
  md: { outer: 145, inner: 131 },
  lg: { outer: 190, inner: 174 },
}

const PHOTO_POSITIONS: Record<string, React.CSSProperties> = {
  'top-center': { top: '13%', left: '50%', transform: 'translateX(-50%)' },
  'center':     { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' },
  'top-left':   { top: '14%', left: 20 },
  'top-right':  { top: '14%', right: 20 },
}

export default function InvitationCard({ event }: { event: Event }) {
  const template  = getTemplate(event.template_id ?? event.theme ?? 'birthday')
  const banner    = getBanner(event.banner_id)
  const eventDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy')

  const hasPhoto   = !!event.child_photo_url
  const photoSize  = PHOTO_SIZES[event.child_photo_size ?? 'md']
  const photoPos   = PHOTO_POSITIONS[event.child_photo_position ?? 'top-center']

  // Gradient scrim adapts to photo presence & position
  const scrim = !hasPhoto
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.72) 100%)'
    : event.child_photo_position === 'center'
    ? 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.82) 100%)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.1) 40%, transparent 52%, rgba(0,0,0,0.80) 100%)'

  return (
    <div
      className="relative overflow-hidden w-full"
      style={{
        maxWidth: 420,
        aspectRatio: '5 / 7',
        borderRadius: 24,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
      }}
    >
      {/* ── Background ─────────────────────────────────────────────────── */}
      {event.banner_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.banner_url} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : banner ? (
        <banner.Component
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: template.header.background }}>
          {template.header.overlay && (
            <div style={{ position: 'absolute', inset: 0, background: template.header.overlay }}/>
          )}
          {template.header.decorEmojis.map((em, i) => {
            const pos = [
              { top: '8%', left: '8%' },    { top: '6%', right: '10%' },
              { top: '30%', left: '5%' },   { top: '28%', right: '6%' },
              { top: '55%', left: '7%' },   { top: '52%', right: '8%' },
              { bottom: '8%', left: '10%' }, { bottom: '6%', right: '12%' },
            ][i % 8]
            return (
              <span key={i} style={{
                position: 'absolute', fontSize: 36, opacity: 0.45,
                transform: `rotate(${(i * 37) % 60 - 30}deg)`, ...pos,
              }}>{em}</span>
            )
          })}
        </div>
      )}

      {/* ── Gradient scrim ──────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, background: scrim }}/>

      {/* ── Tagline badge ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        background: template.button.background,
        color: template.button.text,
        padding: '4px 12px', borderRadius: 999,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
        textTransform: 'uppercase', opacity: 0.92, zIndex: 10,
      }}>
        {template.header.tagline}
      </div>

      {/* ── Child photo ─────────────────────────────────────────────────── */}
      {hasPhoto && (
        <div style={{ position: 'absolute', zIndex: 10, ...photoPos }}>
          {/* Glow ring */}
          <div style={{
            width: photoSize.outer,
            height: photoSize.outer,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 3px rgba(255,255,255,0.55), 0 8px 32px rgba(0,0,0,0.45)',
          }}>
            <div style={{
              width: photoSize.inner,
              height: photoSize.inner,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.child_photo_url!}
                alt="Birthday child"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom text content ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px 24px 28px',
        textAlign: 'center',
        zIndex: 10,
      }}>
        {/* Emoji — hide when photo is present */}
        {!hasPhoto && (
          <div style={{ fontSize: 52, marginBottom: 8, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
            {event.cover_emoji}
          </div>
        )}

        <h1 style={{
          color: 'white', fontSize: 24, fontWeight: 900, lineHeight: 1.2,
          marginBottom: 5, textShadow: '0 2px 16px rgba(0,0,0,0.6)',
        }}>
          {event.title}
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500,
          marginBottom: 16, textShadow: '0 1px 6px rgba(0,0,0,0.5)',
        }}>
          Hosted by {event.host_name}
        </p>

        {/* Frosted glass date/venue pill */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 14,
          padding: '10px 16px',
          display: 'inline-block',
          textAlign: 'left',
          minWidth: 200,
        }}>
          <p style={{ color: 'white', fontSize: 12, fontWeight: 600, marginBottom: 4, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            📅 {eventDate}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500, marginBottom: 4, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            ⏰ {event.time}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            📍 {event.venue}
          </p>
        </div>
      </div>
    </div>
  )
}
