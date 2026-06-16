'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplatePicker from '@/components/TemplatePicker'
import BannerPicker from '@/components/BannerPicker'
import { getTemplate } from '@/lib/templates'
import { getBanner, getBannersForTemplate } from '@/lib/banners'

type Step = 'template' | 'banner' | 'details'

export default function CreateClient() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('template')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    template_id: 'birthday',
    banner_id: null as string | null,
    banner_url: null as string | null,
    host_name: '',
    host_email: '',
    title: '',
    date: '',
    time: '18:00',
    venue: '',
    venue_address: '',
    description: '',
    cover_emoji: '🎂',
    plus_ones_allowed: true,
    message_prompt: 'Looking forward to seeing you!',
  })

  const set = (field: string, value: string | boolean | null) =>
    setForm(f => ({ ...f, [field]: value }))

  const selectedTemplate = getTemplate(form.template_id)

  // Auto-select the first banner for the chosen template when moving to banner step
  function goToBanner() {
    if (!form.banner_id && !form.banner_url) {
      const first = getBannersForTemplate(form.template_id)?.[0]
      if (first) setForm(f => ({ ...f, banner_id: first.id, banner_url: null }))
    }
    setStep('banner')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, theme: form.template_id }),
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

  // ── Step indicator ───────────────────────────────────────────────────────
  const steps: { key: Step; label: string }[] = [
    { key: 'template', label: 'Theme' },
    { key: 'banner',   label: 'Banner' },
    { key: 'details',  label: 'Details' },
  ]
  const stepIdx = steps.findIndex(s => s.key === step)

  const StepBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full transition-colors ${
            i < stepIdx ? 'bg-green-100 text-green-700'
            : i === stepIdx ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-400'
          }`}>
            {i < stepIdx && <span>✓</span>}
            <span>{i + 1}. {s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="w-4 h-px bg-gray-300"/>}
        </div>
      ))}
    </div>
  )

  // ── Step 1: Pick a template ──────────────────────────────────────────────
  if (step === 'template') {
    return (
      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <StepBar/>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Choose a theme</h1>
            <p className="text-gray-500 mt-1">Pick the design for your invitation</p>
          </div>

          <div className="card mb-6">
            <TemplatePicker
              selected={form.template_id}
              onSelect={id => {
                set('template_id', id)
                // Reset banner when theme changes
                set('banner_id', null)
                set('banner_url', null)
              }}
            />
          </div>

          {/* Preview strip */}
          <div className="rounded-2xl overflow-hidden mb-6 shadow-md">
            <div className="h-28 flex flex-col items-center justify-center gap-2 text-center px-4 relative overflow-hidden"
              style={{ background: selectedTemplate.header.background }}>
              {selectedTemplate.header.overlay && (
                <div className="absolute inset-0" style={{ background: selectedTemplate.header.overlay, mixBlendMode: 'multiply' }}/>
              )}
              <div className="relative z-10 flex gap-2 text-2xl mb-1">
                {selectedTemplate.header.decorEmojis.slice(0, 5).map((e, i) => <span key={i}>{e}</span>)}
              </div>
              <p className="relative z-10 font-bold text-lg"
                style={{ color: selectedTemplate.header.textColor, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                {selectedTemplate.header.tagline}
              </p>
            </div>
            <div className="bg-white px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{selectedTemplate.emoji} {selectedTemplate.name}</span>
                {' '}· {selectedTemplate.description}
              </p>
              <span className="text-xs text-gray-400">{selectedTemplate.ageRange}</span>
            </div>
          </div>

          <button onClick={goToBanner} className="btn-primary w-full py-4 text-lg">
            Choose a banner →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 2: Pick a banner ────────────────────────────────────────────────
  if (step === 'banner') {
    const currentBanner = getBanner(form.banner_id)
    return (
      <div className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <StepBar/>
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => setStep('template')} className="text-purple-600 text-sm hover:underline">
              ← Change theme
            </button>
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
              <span>{selectedTemplate.emoji}</span>
              <span className="text-sm font-semibold text-purple-700">{selectedTemplate.name}</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Choose a banner</h1>
          <p className="text-gray-500 mb-6">This appears at the top of your invite — no text on it, just pure art</p>

          {/* Live preview */}
          {(form.banner_id || form.banner_url) && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-md border-2 border-purple-200">
              <div className="bg-gray-100 text-xs text-center py-1 text-gray-400 font-medium tracking-wide uppercase">Preview</div>
              {form.banner_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.banner_url} alt="Preview" className="w-full object-cover" style={{ maxHeight: 200 }}/>
              ) : currentBanner ? (
                <currentBanner.Component className="w-full" style={{ display: 'block', maxHeight: 200 }}/>
              ) : null}
              <div className="h-1.5" style={{ background: selectedTemplate.button.background }}/>
              <div className="bg-white px-4 py-3 text-center">
                <p className="text-gray-400 text-xs">Title & details will appear below the banner on the actual invite</p>
              </div>
            </div>
          )}

          <div className="card">
            <BannerPicker
              templateId={form.template_id}
              selectedBannerId={form.banner_id}
              customBannerUrl={form.banner_url}
              onSelect={(bannerId, customUrl) => {
                setForm(f => ({ ...f, banner_id: bannerId, banner_url: customUrl }))
              }}
            />
          </div>

          <button
            onClick={() => setStep('details')}
            className="btn-primary w-full py-4 text-lg mt-6"
            disabled={!form.banner_id && !form.banner_url}
          >
            Fill in event details →
          </button>
        </div>
      </div>
    )
  }

  // ── Step 3: Fill in event details ────────────────────────────────────────
  const currentBanner = getBanner(form.banner_id)

  return (
    <div className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <StepBar/>
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setStep('banner')} className="text-purple-600 text-sm hover:underline">
            ← Change banner
          </button>
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
            <span>{selectedTemplate.emoji}</span>
            <span className="text-sm font-semibold text-purple-700">{selectedTemplate.name}</span>
          </div>
          {(form.banner_id || form.banner_url) && (
            <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {form.banner_url ? '📸 Custom' : `🖼️ ${currentBanner?.name ?? 'Banner'}`}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Event details</h1>
        <p className="text-gray-500 mb-8">Fill in the info — takes 2 minutes</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Host */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">About you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Your name *</label>
                <input className="input" required value={form.host_name}
                  onChange={e => set('host_name', e.target.value)} placeholder="Alex"/>
              </div>
              <div>
                <label className="label">Your email *</label>
                <input className="input" type="email" required value={form.host_email}
                  onChange={e => set('host_email', e.target.value)} placeholder="alex@email.com"/>
                <p className="text-xs text-gray-400 mt-1">We'll send RSVPs here</p>
              </div>
            </div>
          </div>

          {/* Event */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">The party</h2>
            <div>
              <label className="label">Party title *</label>
              <input className="input" required value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Liam's Minecraft 7th Birthday!"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Date *</label>
                <input className="input" type="date" required value={form.date}
                  onChange={e => set('date', e.target.value)}/>
              </div>
              <div>
                <label className="label">Time *</label>
                <input className="input" type="time" required value={form.time}
                  onChange={e => set('time', e.target.value)}/>
              </div>
            </div>
            <div>
              <label className="label">Venue *</label>
              <input className="input" required value={form.venue}
                onChange={e => set('venue', e.target.value)} placeholder="Our backyard"/>
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.venue_address}
                onChange={e => set('venue_address', e.target.value)} placeholder="123 Main St"/>
            </div>
            <div>
              <label className="label">Message to guests</label>
              <textarea className="input resize-none" rows={3} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Come dressed as your favourite Minecraft character! Cake and snacks provided 🎂"/>
            </div>
          </div>

          {/* Cover emoji */}
          <div className="card">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Cover emoji</h2>
            <div className="flex flex-wrap gap-2">
              {['🎂','🎉','🥳','🎈','🎁','🌟','🦄','🍰','🎀','🥂','⛏️','🕷️','🍌','⚔️','🎮','👑','🌈','💎'].map(e => (
                <button key={e} type="button"
                  onClick={() => set('cover_emoji', e)}
                  className={`text-2xl w-12 h-12 rounded-xl border-2 transition-all ${
                    form.cover_emoji === e ? 'border-purple-500 bg-purple-50 scale-110' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="card">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.plus_ones_allowed}
                onChange={e => set('plus_ones_allowed', e.target.checked)}
                className="w-5 h-5 rounded accent-purple-600"/>
              <span className="text-gray-700">Allow guests to bring siblings / +1s</span>
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
