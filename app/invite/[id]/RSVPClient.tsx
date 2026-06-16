'use client'

import { useState } from 'react'
import type { Event } from '@/lib/types'
import { getTemplate } from '@/lib/templates'
import { getBanner } from '@/lib/banners'
import { format, parseISO } from 'date-fns'

export default function RSVPClient({ event }: { event: Event }) {
  const template = getTemplate(event.template_id ?? event.theme ?? 'birthday')
  const banner = getBanner(event.banner_id)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rsvp_status: '' as 'attending' | 'not_attending' | 'maybe' | '',
    plus_one_count: 0,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eventDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rsvp_status) { setError('Please choose your RSVP status'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit RSVP')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (submitted) {
    const msgs = {
      attending:     { emoji: '🎉', headline: "You're going!",        sub: "Can't wait to celebrate!" },
      not_attending: { emoji: '😢', headline: 'Sorry to miss you!',   sub: `${event.host_name} will miss you.` },
      maybe:         { emoji: '🤔', headline: 'Maybe see you there!', sub: 'Let us know when you decide.' },
    }
    const msg = msgs[form.rsvp_status as keyof typeof msgs] ?? msgs.attending
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg"
          style={{ background: template.header.background }}>
          {msg.emoji}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{msg.headline}</h1>
        <p className="text-gray-500 text-lg mb-8">{msg.sub}</p>
        <div className="card max-w-sm w-full text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{event.cover_emoji}</span>
            <div>
              <p className="font-bold text-gray-900">{event.title}</p>
              <p className="text-gray-500 text-sm">{eventDate} · {event.time}</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm">📍 {event.venue}</p>
        </div>
        <p className="text-gray-400 text-sm mt-6">
          A confirmation was sent to <strong>{form.email}</strong>
        </p>
      </div>
    )
  }

  // ── Main page ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 pb-16">

      {/* ── Invitation Card ─────────────────────────────────────────────── */}
      <div className="flex justify-center px-4 pt-8 pb-6">
        <div
          className="relative overflow-hidden w-full"
          style={{
            maxWidth: 420,
            aspectRatio: '5 / 7',
            borderRadius: 24,
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          }}
        >
          {/* Background: themed SVG or custom image filling the card */}
          {event.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.banner_url}
              alt=""
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
              {/* Scattered emojis as fallback */}
              {template.header.decorEmojis.map((em, i) => {
                const pos = [
                  { top: '8%',  left: '8%' },  { top: '6%',  right: '10%' },
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

          {/* Gradient scrim — top fade + strong bottom fade for text */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.72) 100%)',
          }}/>

          {/* Top-left: tagline badge */}
          <div style={{
            position: 'absolute', top: 20, left: 20,
            background: template.button.background,
            color: template.button.text,
            padding: '4px 12px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
            textTransform: 'uppercase', opacity: 0.92,
          }}>
            {template.header.tagline}
          </div>

          {/* Card text content — bottom of card */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '28px 28px 32px',
            textAlign: 'center',
          }}>
            {/* Emoji */}
            <div style={{ fontSize: 52, marginBottom: 10, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
              {event.cover_emoji}
            </div>

            {/* Title */}
            <h1 style={{
              color: 'white',
              fontSize: 26,
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 6,
              textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            }}>
              {event.title}
            </h1>

            {/* Host */}
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 18,
              textShadow: '0 1px 6px rgba(0,0,0,0.5)',
            }}>
              Hosted by {event.host_name}
            </p>

            {/* Date / Venue pill — frosted glass */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 14,
              padding: '12px 18px',
              display: 'inline-block',
              textAlign: 'left',
              minWidth: 200,
            }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 5, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                📅 {eventDate}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, marginBottom: event.venue ? 5 : 0, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                ⏰ {event.time}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                📍 {event.venue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Description (if any) ────────────────────────────────────────── */}
      {event.description && (
        <div className="max-w-md mx-auto px-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
            <p className="text-gray-600 text-sm italic text-center">{event.description}</p>
          </div>
        </div>
      )}

      {/* ── RSVP form ───────────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto px-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Will you be there?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Status buttons */}
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'attending',     emoji: '✅', label: "I'm in!" },
                { value: 'maybe',         emoji: '🤔', label: 'Maybe' },
                { value: 'not_attending', emoji: '❌', label: "Can't make it" },
              ] as const).map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, rsvp_status: opt.value }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.rsvp_status === opt.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                  style={form.rsvp_status === opt.value ? {
                    borderColor: template.button.background,
                    backgroundColor: template.button.background + '18',
                    color: template.button.background,
                  } : {}}>
                  <span className="text-2xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Your name *</label>
              <input className="input" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith"/>
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@email.com"/>
            </div>
            <div>
              <label className="label">Phone (optional)</label>
              <input className="input" type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"/>
            </div>

            {event.plus_ones_allowed && form.rsvp_status === 'attending' && (
              <div>
                <label className="label">Bringing anyone? (+1s)</label>
                <select className="input" value={form.plus_one_count}
                  onChange={e => setForm(f => ({ ...f, plus_one_count: parseInt(e.target.value) }))}>
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Just me' : `+${n} guest${n > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label">Message for {event.host_name} (optional)</label>
              <textarea className="input resize-none" rows={3} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={event.message_prompt ?? 'Say something nice…'}/>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg transition-opacity disabled:opacity-50"
              style={{ background: template.button.background, color: template.button.text }}>
              {loading ? 'Sending RSVP…' : `${template.emoji} Send my RSVP!`}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs pb-4">
          Powered by <span className="font-semibold" style={{ color: template.button.background }}>Le` Invitation</span> — free forever
        </p>
      </div>
    </div>
  )
}
