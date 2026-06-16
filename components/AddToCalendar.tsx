'use client'

import type { Event } from '@/lib/types'

// Format: 20250719T150000 (local floating time — no Z, no timezone)
function fmtDt(dateStr: string, timeStr: string) {
  return `${dateStr.replace(/-/g, '')}T${timeStr.replace(':', '')}00`
}

function endDt(dateStr: string, timeStr: string, durationHours = 2) {
  const d = new Date(`${dateStr}T${timeStr}`)
  d.setHours(d.getHours() + durationHours)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  )
}

function googleUrl(event: Event) {
  const start = fmtDt(event.date, event.time)
  const end   = endDt(event.date, event.time)
  const loc   = [event.venue, event.venue_address].filter(Boolean).join(', ')
  const desc  = `Hosted by ${event.host_name}${event.description ? '\n\n' + event.description : ''}`
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: desc,
    location: loc,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

function downloadIcs(event: Event) {
  const start = fmtDt(event.date, event.time)
  const end   = endDt(event.date, event.time)
  const loc   = [event.venue, event.venue_address].filter(Boolean).join(', ')
  const desc  = `Hosted by ${event.host_name}${event.description ? '\\n\\n' + event.description : ''}`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Le` Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@leinvitation.com`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AddToCalendar({
  event,
  variant = 'default',
}: {
  event: Event
  variant?: 'default' | 'compact'
}) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-2">
        <a
          href={googleUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
        >
          <i className="ti ti-brand-google" style={{ fontSize: 15 }} aria-hidden="true" />
          Google
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(event)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
        >
          <i className="ti ti-brand-apple" style={{ fontSize: 15 }} aria-hidden="true" />
          Apple
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-2">
        Add to calendar
      </p>
      <div className="flex divide-x divide-gray-100">
        <a
          href={googleUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 transition-colors text-gray-600 text-sm font-medium"
        >
          <i className="ti ti-brand-google" style={{ fontSize: 16 }} aria-hidden="true" />
          Google
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(event)}
          className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-50 transition-colors text-gray-600 text-sm font-medium"
        >
          <i className="ti ti-brand-apple" style={{ fontSize: 16 }} aria-hidden="true" />
          Apple
        </button>
      </div>
    </div>
  )
}
