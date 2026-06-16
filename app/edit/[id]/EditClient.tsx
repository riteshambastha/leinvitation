'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types'
import BannerPicker from '@/components/BannerPicker'
import { getTemplate } from '@/lib/templates'
import { getBanner } from '@/lib/banners'
import PreviewModal from '@/components/PreviewModal'

export default function EditClient({
  event,
  token,
}: {
  event: Event
  token: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)

  const [form, setForm] = useState({
    template_id:          event.template_id ?? event.theme ?? 'birthday',
    banner_id:            event.banner_id   ?? null as string | null,
    banner_url:           event.banner_url  ?? null as string | null,
    child_photo_url:      event.child_photo_url      ?? null as string | null,
    child_photo_size:     (event.child_photo_size     ?? 'md') as 'sm' | 'md' | 'lg',
    child_photo_position: (event.child_photo_position ?? 'top-center') as 'top-center' | 'center' | 'top-left' | 'top-right',
    title:            event.title,
    date:             event.date,
    time:             event.time,
    venue:            event.venue,
    venue_address:    event.venue_address  ?? '',
    description:      event.description   ?? '',
    cover_emoji:      event.cover_emoji,
    plus_ones_allowed: event.plus_ones_allowed,
    message_prompt:   event.message_prompt ?? 'Looking forward to seeing you!',
  })

  const set = (field: string, value: string | boolean | null) =>
    setForm(f => ({ ...f, [field]: value }))

  const selectedTemplate = getTemplate(form.template_id)
  const selectedBanner = getBanner(form.banner_id)

  // Child photo
  const childPhotoRef = useRef<HTMLInputElement>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  async function handleChildPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) { setPhotoError('Image must be under 8 MB'); return }
    setPhotoError(null)
    setPhotoUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-child-photo', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      set('child_photo_url', data.url)
    } catch (err: unknown) {
      setPhotoError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save changes')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const dashboardHref = token
    ? `/dashboard/${event.id}?token=${token}`
    : `/dashboard/${event.id}`

  const EMOJIS = ['🎂', '🎉', '🥳', '🎈', '🎊', '⭐', '🦄', '🦸', '🎮', '🍕', '🌈', '🏆']

  return (
    <div className="py-10 px-4 pb-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Edit invite</h1>
            <p className="text-gray-500 mt-1">Changes save — your invite link stays the same</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreviewOpen(true)}
              className="btn-secondary text-sm py-2 px-4">
              👁 Preview
            </button>
            <button onClick={() => router.push(dashboardHref)}
              className="btn-secondary text-sm py-2 px-4">
              ← Dashboard
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Child photo */}
          <div className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Child&apos;s photo</h2>
                <p className="text-gray-500 text-sm">Shows as a portrait circle on the invitation card</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full">Optional</span>
            </div>

            {form.child_photo_url ? (
              <div className="space-y-4">
                {/* Photo preview + replace/remove */}
                <div className="flex items-center gap-5">
                  <div style={{
                    width: 90, height: 90, borderRadius: '50%',
                    border: '4px solid #7c3aed',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.child_photo_url} alt="Child photo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-700">✓ Photo uploaded</p>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => childPhotoRef.current?.click()}
                        className="text-sm text-purple-600 font-medium hover:underline">
                        Replace
                      </button>
                      <button type="button" onClick={() => set('child_photo_url', null)}
                        className="text-sm text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Size picker */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Photo size</p>
                  <div className="flex gap-2">
                    {([
                      { value: 'sm', label: 'Small',  desc: 'Subtle' },
                      { value: 'md', label: 'Medium', desc: 'Balanced' },
                      { value: 'lg', label: 'Large',  desc: 'Hero' },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, child_photo_size: opt.value }))}
                        className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm transition-all ${
                          form.child_photo_size === opt.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                            : 'border-gray-200 text-gray-500 hover:border-purple-300'
                        }`}>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position picker */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Photo position</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'top-center', label: '⬆ Top center' },
                      { value: 'center',     label: '⊙ Center' },
                      { value: 'top-left',   label: '↖ Top left' },
                      { value: 'top-right',  label: '↗ Top right' },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setForm(f => ({ ...f, child_photo_position: opt.value }))}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.child_photo_position === opt.value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-500 hover:border-purple-300'
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live preview button */}
                <button type="button" onClick={() => setPreviewOpen(true)}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-purple-300 text-purple-600 text-sm font-semibold hover:bg-purple-50 transition-colors">
                  👁 Preview card with this photo
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => childPhotoRef.current?.click()}
                disabled={photoUploading}
                className="w-full border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50 rounded-2xl py-7 flex flex-col items-center gap-3 transition-all disabled:opacity-50">
                {photoUploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"/>
                    <span className="text-sm text-gray-500">Uploading…</span>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-3xl">
                      👶
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Upload your child&apos;s photo</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG · Max 8 MB</p>
                    </div>
                  </>
                )}
              </button>
            )}
            <input ref={childPhotoRef} type="file" accept="image/*" className="hidden"
              onChange={handleChildPhotoUpload}/>
            {photoError && <p className="text-red-500 text-sm mt-2">{photoError}</p>}
          </div>

          {/* Banner */}
          <div className="card">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Banner / design</h2>
            <p className="text-gray-500 text-sm mb-4">Pick a themed banner or upload your own image</p>

            {/* Mini preview */}
            {(form.banner_id || form.banner_url) && (
              <div className="mb-4 rounded-xl overflow-hidden border border-gray-200"
                style={{ height: 100 }}>
                {form.banner_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.banner_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : selectedBanner ? (
                  <selectedBanner.Component
                    preserveAspectRatio="xMidYMid slice"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : null}
              </div>
            )}

            <BannerPicker
              templateId={form.template_id}
              selectedBannerId={form.banner_id}
              customBannerUrl={form.banner_url}
              onSelect={(bannerId, bannerUrl) => {
                setForm(f => ({ ...f, banner_id: bannerId, banner_url: bannerUrl }))
              }}
            />
          </div>

          {/* Event details */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Event details</h2>

            <div>
              <label className="label">Party title *</label>
              <input className="input" required value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Emma's 5th Birthday Bash!"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                onChange={e => set('venue', e.target.value)}
                placeholder="Chuck E. Cheese, Hoboken NJ"/>
            </div>

            <div>
              <label className="label">Venue address (optional)</label>
              <input className="input" value={form.venue_address}
                onChange={e => set('venue_address', e.target.value)}
                placeholder="123 Main St, City, State"/>
            </div>

            <div>
              <label className="label">Description / special instructions (optional)</label>
              <textarea className="input resize-none" rows={3} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Bring your dancing shoes! Cake will be served at 3pm."/>
            </div>
          </div>

          {/* Emoji */}
          <div className="card">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Card emoji</h2>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button key={em} type="button"
                  onClick={() => set('cover_emoji', em)}
                  className={`w-11 h-11 text-2xl rounded-xl border-2 transition-all flex items-center justify-center ${
                    form.cover_emoji === em
                      ? 'border-purple-500 bg-purple-50 scale-110'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* RSVP settings */}
          <div className="card space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">RSVP settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600"
                checked={form.plus_ones_allowed}
                onChange={e => set('plus_ones_allowed', e.target.checked)}/>
              <span className="text-gray-700 text-sm font-medium">Allow guests to bring plus-ones</span>
            </label>
            <div>
              <label className="label">Custom RSVP message prompt (optional)</label>
              <input className="input" value={form.message_prompt}
                onChange={e => set('message_prompt', e.target.value)}
                placeholder="Leave a message for the birthday kid!"/>
            </div>
          </div>

          {/* Save button */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 btn-primary py-4 text-lg font-bold disabled:opacity-50">
              {loading ? 'Saving…' : saved ? '✅ Saved!' : '💾 Save changes'}
            </button>
            <button type="button" onClick={() => router.push(dashboardHref)}
              className="btn-secondary py-4 px-6 font-semibold">
              Cancel
            </button>
          </div>

          {saved && (
            <p className="text-center text-green-600 text-sm font-medium">
              Changes saved — your invite link is still the same ✨
            </p>
          )}
        </form>
      </div>

      {/* Preview modal — merges saved event with live form state */}
      {previewOpen && (
        <PreviewModal
          event={{
            ...event,
            ...form,
            banner_id:            form.banner_id            ?? undefined,
            banner_url:           form.banner_url           ?? undefined,
            child_photo_url:      form.child_photo_url      ?? undefined,
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
