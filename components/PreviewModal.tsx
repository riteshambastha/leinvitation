'use client'

import { useEffect } from 'react'
import type { Event } from '@/lib/types'
import InvitationCard from './InvitationCard'

export default function PreviewModal({
  event,
  onClose,
}: {
  event: Event
  onClose: () => void
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const inviteLink = `${window.location.origin}/invite/${event.id}`

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Card container — stop click propagation so clicking card doesn't close */}
      <div
        className="flex flex-col items-center gap-4 w-full"
        style={{ maxWidth: 420 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-white font-bold text-sm">Invitation preview</p>
            <p className="text-white/60 text-xs">This is exactly what guests see</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* The card */}
        <div className="w-full">
          <InvitationCard event={event} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(inviteLink)
            }}
            className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
          >
            🔗 Copy invite link
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
