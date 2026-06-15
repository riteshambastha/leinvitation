'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const THEMES = [
  { id: 'confetti', label: '🎊 Confetti', color: 'from-yellow-400 to-pink-500' },
  { id: 'elegant', label: '🌹 Elegant', color: 'from-rose-400 to-red-600' },
  { id: 'garden', label: '🌸 Garden', color: 'from-green-400 to-emerald-600' },
  { id: 'retro', label: '🕺 Retro', color: 'from-orange-400 to-purple-600' },
  { id: 'minimal', label: '✨ Minimal', color: 'from-gray-400 to-slate-600' },
]

const EMOJIS = ['🎂', '🎉', '🥳', '🎈', '🎁', '🌟', '🦄', '🍰', '🎀', '🥂']

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState<'landing' | 'create'>('landing')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    host_name: '',
    host_email: '',
    title: '',
    date: '',
    time: '18:00',
    venue: '',
    venue_address: '',
    description: '',
    theme: 'confetti',
    cover_emoji: '🎂',
    plus_ones_allowed: true,
    message_prompt: 'Looking forward to seeing you!',
  })

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create invite')
      router.push(`/dashboard/${data.id}?token=${data.dashboard_token}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'landing') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
          <span className="text-2xl font-bold text-purple-700">🎂 BdayInvite</span>
          <button onClick={() => setStep('create')} className="btn-primary text-sm py-2 px-4">
            Create Invite
          </button>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Birthday invites,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              completely free.
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-lg">
            Create beautiful invitations, share a link, collect RSVPs, and manage your guest list — no subscriptions, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setStep('create')} className="btn-primary text-lg px-8 py-4">
              Create my invite →
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full text-left">
            {[
              { emoji: '✉️', title: 'Email invites', desc: 'Send personalized invites directly to each guest\'s inbox.' },
              { emoji: '✅', title: 'RSVP tracking', desc: 'Guests RSVP with one click — you see live updates.' },
              { emoji: '📋', title: 'Guest list', desc: 'See who\'s coming, who hasn\'t replied, and send reminders.' },
            ].map(f => (
              <div key={f.title} className="card">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <button onClick={() => setStep('landing')} className="text-purple-600 text-sm mb-4 hover:underline">
            ← Back
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Create your invite</h1>
          <p className="text-gray-500 mt-2">Fill in the details — takes 2 minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Host info */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">About you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your name *</label>
                <input className="input" required value={form.host_name}
                  onChange={e => set('host_name', e.target.value)} placeholder="Alex" />
              </div>
              <div>
                <label className="label">Your email *</label>
                <input className="input" type="email" required value={form.host_email}
                  onChange={e => set('host_email', e.target.value)} placeholder="alex@email.com" />
                <p className="text-xs text-gray-400 mt-1">We'll email you RSVPs and your dashboard link</p>
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Event details</h2>
            <div>
              <label className="label">Party title *</label>
              <input className="input" required value={form.title}
                onChange={e => set('title', e.target.value)} placeholder="Alex's 30th Birthday Bash!" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Date *</label>
                <input className="input" type="date" required value={form.date}
                  onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label className="label">Time *</label>
                <input className="input" type="time" required value={form.time}
                  onChange={e => set('time', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Venue name *</label>
              <input className="input" required value={form.venue}
                onChange={e => set('venue', e.target.value)} placeholder="The Rooftop Bar" />
            </div>
            <div>
              <label className="label">Venue address</label>
              <input className="input" value={form.venue_address}
                onChange={e => set('venue_address', e.target.value)} placeholder="123 Main St, San Francisco" />
            </div>
            <div>
              <label className="label">Message to guests</label>
              <textarea className="input resize-none" rows={3} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Come celebrate with us! Dress code: smart casual..." />
            </div>
          </div>

          {/* Theme & emoji */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Look & feel</h2>
            <div>
              <label className="label">Cover emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button"
                    onClick={() => set('cover_emoji', e)}
                    className={`text-2xl w-12 h-12 rounded-xl border-2 transition-all ${form.cover_emoji === e ? 'border-purple-500 bg-purple-50 scale-110' : 'border-gray-200 hover:border-purple-300'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {THEMES.map(t => (
                  <button key={t.id} type="button"
                    onClick={() => set('theme', t.id)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.theme === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Options</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.plus_ones_allowed}
                onChange={e => set('plus_ones_allowed', e.target.checked)}
                className="w-5 h-5 rounded accent-purple-600" />
              <span className="text-gray-700">Allow guests to bring +1s</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
            {loading ? 'Creating your invite...' : '🎉 Create invite & get my link'}
          </button>
        </form>
      </div>
    </div>
  )
}
