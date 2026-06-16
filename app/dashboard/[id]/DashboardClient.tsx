'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Event, Guest } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import PreviewModal from '@/components/PreviewModal'

type Filter = 'all' | 'attending' | 'not_attending' | 'maybe'

type GuestForm = {
  name: string; email: string; phone: string
  rsvp_status: 'attending' | 'not_attending' | 'maybe'
  adult_count: number; kids_count: number
}

export default function DashboardClient({
  event,
  initialGuests,
  token,
}: {
  event: Event
  initialGuests: Guest[]
  token: string | null
}) {
  const router = useRouter()
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [filter, setFilter] = useState<Filter>('all')
  const [addModal, setAddModal] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)

  const blankForm = (): GuestForm => ({
    name: '', email: '', phone: '',
    rsvp_status: 'attending', adult_count: 1, kids_count: 0,
  })
  const [guestForm, setGuestForm] = useState<GuestForm>(blankForm())
  const setGF = (field: keyof GuestForm, value: string | number) =>
    setGuestForm(f => ({ ...f, [field]: value }))

  // Edit modal
  const [editGuest, setEditGuest] = useState<Guest | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  function openEdit(g: Guest) {
    setEditGuest(g)
    setGuestForm({
      name: g.name, email: g.email, phone: g.phone ?? '',
      rsvp_status: g.rsvp_status,
      adult_count: g.adult_count ?? 1, kids_count: g.kids_count ?? 0,
    })
    setEditError(null)
  }
  function closeEdit() { setEditGuest(null); setEditError(null) }
  function closeAdd()  { setAddModal(false); setAddError(null); setGuestForm(blankForm()) }

  const inviteLink = `${window.location.origin}/invite/${event.id}`
  const dashboardLink = window.location.href

  const attending = guests.filter(g => g.rsvp_status === 'attending')
  const notAttending = guests.filter(g => g.rsvp_status === 'not_attending')
  const maybe = guests.filter(g => g.rsvp_status === 'maybe')
  const totalComing = attending.reduce((acc, g) => acc + 1 + g.plus_one_count, 0)

  const visibleGuests = filter === 'all' ? guests
    : guests.filter(g => g.rsvp_status === filter)

  async function copyLink(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function sendInvite(guest: Guest) {
    setSendingTo(guest.id)
    try {
      await fetch('/api/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, guest_ids: [guest.id] }),
      })
      setGuests(gs => gs.map(g => g.id === guest.id
        ? { ...g, invited_at: new Date().toISOString() }
        : g
      ))
    } finally {
      setSendingTo(null)
    }
  }

  async function sendReminder(guest: Guest) {
    setSendingReminder(guest.id)
    try {
      await fetch('/api/send-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, guest_ids: [guest.id] }),
      })
    } finally {
      setSendingReminder(null)
    }
  }

  async function sendAllInvites() {
    const uninvited = guests.filter(g => !g.invited_at)
    if (uninvited.length === 0) return alert('All guests have already been invited!')
    setSendingTo('all')
    try {
      await fetch('/api/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, guest_ids: uninvited.map(g => g.id) }),
      })
      const now = new Date().toISOString()
      setGuests(gs => gs.map(g => uninvited.find(u => u.id === g.id)
        ? { ...g, invited_at: now } : g
      ))
    } finally {
      setSendingTo(null)
    }
  }

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    setAddError(null)
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, ...guestForm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to add guest')
      setGuests(gs => [data, ...gs])
      closeAdd()
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setAddLoading(false)
    }
  }

  async function handleEditGuest(e: React.FormEvent) {
    e.preventDefault()
    if (!editGuest) return
    setEditLoading(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/guests/${editGuest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to update guest')
      setGuests(gs => gs.map(g => g.id === editGuest.id ? data : g))
      closeEdit()
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setEditLoading(false)
    }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      attending: 'bg-green-100 text-green-700',
      not_attending: 'bg-red-100 text-red-700',
      maybe: 'bg-yellow-100 text-yellow-700',
    }
    const labels: Record<string, string> = {
      attending: '✅ Attending',
      not_attending: '❌ Not attending',
      maybe: '🤔 Maybe',
    }
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[status] ?? ''}`}>
        {labels[status] ?? status}
      </span>
    )
  }

  const eventDate = format(parseISO(event.date), 'MMMM d, yyyy')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{event.cover_emoji}</span>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">{event.title}</h1>
              <p className="text-gray-500 text-sm">{eventDate} · {event.time} · {event.venue}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setPreviewOpen(true)}
              className="btn-secondary text-sm py-2 px-4">
              👁 Preview
            </button>
            <button
              onClick={() => copyLink(inviteLink)}
              className="btn-secondary text-sm py-2 px-4">
              {copied ? '✅ Copied!' : '🔗 Copy link'}
            </button>
            <button
              onClick={() => router.push(token ? `/edit/${event.id}?token=${token}` : `/edit/${event.id}`)}
              className="btn-secondary text-sm py-2 px-4">
              ✏️ Edit
            </button>
            <button onClick={sendAllInvites} disabled={sendingTo === 'all'} className="btn-primary text-sm py-2 px-4">
              {sendingTo === 'all' ? 'Sending...' : '✉️ Email all uninvited'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Invited', value: guests.length, color: 'text-gray-900' },
            { label: 'Coming', value: attending.length, color: 'text-green-600' },
            { label: 'Maybe', value: maybe.length, color: 'text-yellow-600' },
            { label: 'Total guests', value: totalComing, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Guest list */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-gray-900">Guest list</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['all', 'attending', 'maybe', 'not_attending'] as Filter[]).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${filter === f ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>
                    {f === 'all' ? `All (${guests.length})` :
                      f === 'attending' ? `Going (${attending.length})` :
                      f === 'maybe' ? `Maybe (${maybe.length})` :
                      `No (${notAttending.length})`}
                  </button>
                ))}
              </div>
              <button onClick={() => setAddModal(true)} className="btn-primary text-xs py-2 px-3">
                + Add guest
              </button>
            </div>
          </div>

          {visibleGuests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p className="font-medium">No guests yet</p>
              <p className="text-sm mt-1">Share your invite link or add guests manually</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleGuests.map(guest => (
                <div key={guest.id} className="py-4 flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900">{guest.name}</p>
                      {statusBadge(guest.rsvp_status)}
                      {guest.plus_one_count > 0 && (
                        <span className="text-xs text-gray-500">+{guest.plus_one_count}</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {guest.email}
                      {guest.phone && <span className="text-gray-400"> · {guest.phone}</span>}
                    </p>
                    {guest.message && (
                      <p className="text-gray-400 text-sm mt-1 italic">"{guest.message}"</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      RSVPed {format(parseISO(guest.rsvped_at), 'MMM d, h:mm a')}
                      {guest.invited_at && ` · Invite sent ${format(parseISO(guest.invited_at), 'MMM d')}`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!guest.invited_at && (
                      <button
                        onClick={() => sendInvite(guest)}
                        disabled={sendingTo === guest.id}
                        className="text-xs btn-secondary py-1.5 px-3">
                        {sendingTo === guest.id ? '...' : '✉️ Send invite'}
                      </button>
                    )}
                    {guest.phone && (
                      <a
                        href={`sms:${guest.phone}?body=You're invited to ${encodeURIComponent(event.title)}! RSVP here: ${inviteLink}`}
                        className="text-xs btn-secondary py-1.5 px-3">
                        📱 Text
                      </a>
                    )}
                    <button
                      onClick={() => sendReminder(guest)}
                      disabled={sendingReminder === guest.id}
                      className="text-xs btn-secondary py-1.5 px-3">
                      {sendingReminder === guest.id ? '...' : '⏰ Remind'}
                    </button>
                    <button
                      onClick={() => openEdit(guest)}
                      className="text-xs btn-secondary py-1.5 px-3">
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite link card */}
        <div className="card bg-purple-50 border-purple-200">
          <h2 className="font-bold text-gray-900 mb-3">Your invite link</h2>
          <p className="text-sm text-gray-500 mb-3">Share this with anyone — they can RSVP directly:</p>
          <div className="flex gap-2">
            <input readOnly className="input text-sm bg-white flex-1" value={inviteLink} />
            <button onClick={() => copyLink(inviteLink)} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Dashboard bookmark */}
        <div className="card bg-amber-50 border-amber-200">
          <h2 className="font-bold text-gray-900 mb-2">⭐ Bookmark this dashboard</h2>
          <p className="text-sm text-gray-600 mb-3">
            This URL contains your private token. Bookmark it now — it was also emailed to you.
          </p>
          <div className="flex gap-2">
            <input readOnly className="input text-sm bg-white flex-1 text-xs" value={dashboardLink} />
            <button onClick={() => copyLink(dashboardLink)} className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <PreviewModal event={event} onClose={() => setPreviewOpen(false)} />
      )}

      {/* ── Add guest modal ─────────────────────────────────────────────── */}
      {addModal && (
        <GuestFormModal
          title="Add guest"
          submitLabel={addLoading ? 'Adding…' : 'Add guest'}
          form={guestForm} setField={setGF}
          onSubmit={handleAddGuest} onClose={closeAdd}
          error={addError} loading={addLoading}
        />
      )}

      {/* ── Edit guest modal ─────────────────────────────────────────────── */}
      {editGuest && (
        <GuestFormModal
          title={`Edit — ${editGuest.name}`}
          submitLabel={editLoading ? 'Saving…' : 'Save changes'}
          form={guestForm} setField={setGF}
          onSubmit={handleEditGuest} onClose={closeEdit}
          error={editError} loading={editLoading}
        />
      )}
    </div>
  )
}

// ── Shared guest form modal ──────────────────────────────────────────────────
function GuestFormModal({
  title, submitLabel, form, setField, onSubmit, onClose, error, loading,
}: {
  title: string
  submitLabel: string
  form: GuestForm
  setField: (field: keyof GuestForm, value: string | number) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  error: string | null
  loading: boolean
}) {
  const attending = form.rsvp_status !== 'not_attending'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Name *</label>
              <input className="input" required value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Jane Smith" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" type="tel" value={form.phone}
                onChange={e => setField('phone', e.target.value)}
                placeholder="+1 555-0100" />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" required value={form.email}
              onChange={e => setField('email', e.target.value)}
              placeholder="jane@email.com" />
          </div>

          {/* RSVP status */}
          <div>
            <label className="label">RSVP status</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'attending',     emoji: '✅', label: "Coming" },
                { value: 'maybe',         emoji: '🤔', label: 'Maybe' },
                { value: 'not_attending', emoji: '❌', label: "Not coming" },
              ] as const).map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setField('rsvp_status', opt.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.rsvp_status === opt.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500 hover:border-purple-300'
                  }`}>
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Adults + Kids — only when coming or maybe */}
          {attending && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Adults 🧑</label>
                <select className="input" value={form.adult_count}
                  onChange={e => setField('adult_count', parseInt(e.target.value))}>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n === 1 ? '1 (just them)' : `${n} adults`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Kids / Siblings 👶</label>
                <select className="input" value={form.kids_count}
                  onChange={e => setField('kids_count', parseInt(e.target.value))}>
                  {[0,1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'None' : `${n} kid${n > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
