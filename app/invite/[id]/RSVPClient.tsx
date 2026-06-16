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
      attending:     { emoji: '🎉', headline: "You're going!",      sub: "Can't wait to celebrate!" },
      not_attending: { emoji: '😢', headline: 'Sorry to miss you!', sub: `${event.host_name} will miss you.` },
      maybe:         { emoji: '🤔', headline: 'Maybe see you there!', sub: 'Let us know when you decide.' },
    }
    const msg = msgs[form.rsvp_status as keyof typeof msgs] ?? msgs.attending

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: 'linear-gradient(135deg, #f9f0ff, #fff0f5)' }}>
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

  // ── Banner area (pure visual — no text on top of it) ─────────────────────
  const BannerSection = () => {
    if (event.banner_url) {
      // Custom uploaded image
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.banner_url}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 260 }}
        />
      )
    }
    if (banner) {
      const { Component } = banner
      return <Component className="w-full" style={{ display: 'block', maxHeight: 260 }}/>
    }
    // Fallback: gradient strip with decorative emojis only
    return (
      <div className="relative w-full overflow-hidden" style={{ height: 220, background: template.header.background }}>
        {template.header.overlay && (
          <div className="absolute inset-0" style={{ background: template.header.overlay }}/>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {template.header.decorEmojis.slice(0, 7).map((em, i) => {
            const positions = [
              { top: '12%', left: '8%' },  { top: '10%', right: '10%' },
              { top: '55%', left: '5%' },  { top: '60%', right: '6%' },
              { top: '35%', left: '50%' }, { bottom: '12%', left: '25%' },
              { bottom: '14%', right: '25%' },
            ]
            return (
              <span key={i} className="absolute text-5xl select-none"
                style={{ ...positions[i], opacity: 0.55, transform: `rotate(${(i * 37) % 60 - 30}deg)` }}>
                {em}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Main RSVP page ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-12 bg-gray-50">

      {/* ── Banner (visual only, nothing written on it) ───────────────────── */}
      <div className="w-full overflow-hidden" style={{ maxHeight: 260 }}>
        <BannerSection/>
      </div>

      {/* ── Accent strip to connect banner with content ───────────────────── */}
      <div className="h-2" style={{ background: template.button.background }}/>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* ── Event title card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 text-center">
          <div className="text-5xl mb-3">{event.cover_emoji}</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{event.title}</h1>
          <p className="text-gray-500 font-medium">Hosted by {event.host_name}</p>
          <p className="text-sm italic mt-1" style={{ color: template.button.background }}>
            {template.header.tagline}
          </p>
        </div>

        {/* ── Event details card ────────────────────────────────────────────── */}
        <div className="card">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">{eventDate}</p>
                <p className="text-gray-500 text-sm">at {event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-gray-900">{event.venue}</p>
                {event.venue_address && <p className="text-gray-500 text-sm">{event.venue_address}</p>}
              </div>
            </div>
            {event.description && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-600 text-sm italic">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RSVP form card ────────────────────────────────────────────────── */}
        <div className="card">
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

        <p className="text-center text-gray-400 text-xs">
          Powered by <span className="font-semibold" style={{ color: template.button.background }}>BdayInvite</span> — free forever
        </p>
      </div>
    </div>
  )
}
