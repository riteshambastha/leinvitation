'use client'

import { useState } from 'react'
import type { Event } from '@/lib/types'
import { format, parseISO } from 'date-fns'

const THEME_GRADIENTS: Record<string, string> = {
  confetti: 'from-yellow-400 via-pink-400 to-purple-500',
  elegant: 'from-rose-400 via-red-500 to-rose-700',
  garden: 'from-green-400 via-emerald-400 to-teal-500',
  retro: 'from-orange-400 via-yellow-400 to-purple-500',
  minimal: 'from-gray-400 via-gray-500 to-slate-600',
}

export default function RSVPClient({ event }: { event: Event }) {
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

  const gradient = THEME_GRADIENTS[event.theme] ?? THEME_GRADIENTS.confetti
  const eventDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rsvp_status) { setError('Please select your RSVP status'); return }
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

  if (submitted) {
    const statusMessages: Record<string, { emoji: string; headline: string; sub: string }> = {
      attending: { emoji: '🎉', headline: "You're going!", sub: "Can't wait to celebrate together!" },
      not_attending: { emoji: '😢', headline: "Sorry to miss you!", sub: `${event.host_name} will miss you.` },
      maybe: { emoji: '🤔', headline: "Maybe see you there!", sub: "Let us know when you decide." },
    }
    const msg = statusMessages[form.rsvp_status] ?? statusMessages.attending

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-5xl mb-6 shadow-lg`}>
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
          A confirmation has been sent to <strong>{form.email}</strong>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${gradient} text-white px-6 py-16 text-center`}>
        <div className="text-7xl mb-4">{event.cover_emoji}</div>
        <h1 className="text-4xl font-extrabold mb-2">{event.title}</h1>
        <p className="text-white/80 text-lg">Hosted by {event.host_name}</p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6">
        {/* Event detail card */}
        <div className="card mb-6">
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

        {/* RSVP form */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Will you be there?</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status selector */}
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'attending', emoji: '✅', label: "I'm in!" },
                { value: 'maybe', emoji: '🤔', label: 'Maybe' },
                { value: 'not_attending', emoji: '❌', label: "Can't make it" },
              ] as const).map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, rsvp_status: opt.value }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    form.rsvp_status === opt.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}>
                  <span className="text-2xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Your name *</label>
              <input className="input" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith" />
            </div>

            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@email.com" />
            </div>

            <div>
              <label className="label">Phone (optional)</label>
              <input className="input" type="tel" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000" />
            </div>

            {event.plus_ones_allowed && form.rsvp_status === 'attending' && (
              <div>
                <label className="label">Bringing anyone? (+1s)</label>
                <select className="input" value={form.plus_one_count}
                  onChange={e => setForm(f => ({ ...f, plus_one_count: parseInt(e.target.value) }))}>
                  {[0, 1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Just me' : `+${n}`}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label">Message for {event.host_name} (optional)</label>
              <textarea className="input resize-none" rows={3} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder={event.message_prompt ?? 'Say something nice...'} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
              {loading ? 'Sending RSVP...' : 'Send my RSVP 🎉'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by <span className="text-purple-500 font-semibold">BdayInvite</span> — free birthday invitations
        </p>
      </div>
    </div>
  )
}
