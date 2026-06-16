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
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
        >
          <GoogleIcon />
          Google
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(event)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
        >
          <AppleIcon />
          Apple
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-3">
        Add to calendar
      </p>
      <div className="flex divide-x divide-gray-100">
        <a
          href={googleUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-2 py-4 hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon size={28} />
          <span className="text-sm font-medium text-gray-700">Google</span>
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(event)}
          className="flex-1 flex flex-col items-center gap-2 py-4 hover:bg-gray-50 transition-colors"
        >
          <AppleIcon size={28} />
          <span className="text-sm font-medium text-gray-700">Apple</span>
        </button>
      </div>
    </div>
  )
}

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
      <path fill="#555" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.5 171.9 46.5 41.4 0 106.3-49 184.8-49 35.8 0 134.2 3.2 201.7 95.8zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
    </svg>
  )
}
