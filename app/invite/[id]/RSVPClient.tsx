'use client'

import { useState } from 'react'
import type { Event } from '@/lib/types'
import { getTemplate } from '@/lib/templates'
import { format, parseISO } from 'date-fns'
import InvitationCard from '@/components/InvitationCard'
import AddToCalendar from '@/components/AddToCalendar'


export default function RSVPClient({ event }: { event: Event }) {
  const template = getTemplate(event.template_id ?? event.theme ?? 'birthday')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rsvp_status: '' as 'attending' | 'not_attending' | 'maybe' | '',
    adult_count: 1,
    kids_count: 0,
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
          <p className="text-gray-500 text-sm mb-4">📍 {event.venue}</p>
          {form.rsvp_status === 'attending' && (
            <AddToCalendar event={event} variant="compact" />
          )}
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
        <InvitationCard event={event} />
      </div>

      {/* ── Add to calendar ─────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto px-4 mb-4">
        <AddToCalendar event={event} />
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

            {form.rsvp_status === 'attending' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Adults 🧑</label>
                  <select className="input" value={form.adult_count}
                    onChange={e => setForm(f => ({ ...f, adult_count: parseInt(e.target.value) }))}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n === 1 ? '1 (just me)' : `${n} adults`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Kids / Siblings 👶</label>
                  <select className="input" value={form.kids_count}
                    onChange={e => setForm(f => ({ ...f, kids_count: parseInt(e.target.value) }))}>
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n === 0 ? 'None' : `${n} kid${n > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>
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

        <div className="text-center text-gray-400 text-xs pb-6 space-y-1">
          <p>
            Powered by{' '}
            <span className="font-semibold" style={{ color: template.button.background }}>Le&#96; Invitation</span>
            {' '}— free forever
          </p>
          <p>Le&#96; Invitation is a product of <span className="font-medium text-gray-500">Rich Gravity Solutions LLC, NJ</span></p>
        </div>
      </div>
    </div>
  )
}
