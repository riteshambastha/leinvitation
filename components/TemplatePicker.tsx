'use client'

import { TEMPLATES, type InviteTemplate } from '@/lib/templates'
import { useState } from 'react'

type Filter = 'all' | 'boys' | 'girls'

export default function TemplatePicker({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = TEMPLATES.filter(t =>
    filter === 'all' ? true : t.tags.includes(filter) || t.tags.includes('all')
  )

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'girls', 'boys'] as Filter[]).map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
              filter === f
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'border-gray-200 text-gray-500 hover:border-purple-300'
            }`}>
            {f === 'all' ? '🎉 All' : f === 'girls' ? '👧 Girls' : '👦 Boys'}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {visible.map(t => (
          <TemplateCard key={t.id} template={t} selected={selected === t.id} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({
  template: t,
  selected,
  onSelect,
}: {
  template: InviteTemplate
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button type="button" onClick={() => onSelect(t.id)}
      className={`relative rounded-2xl overflow-hidden border-4 transition-all text-left ${
        selected ? 'border-purple-500 scale-105 shadow-lg' : 'border-transparent hover:border-purple-300 hover:scale-102'
      }`}>

      {/* Preview banner */}
      <div className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: t.preview.background }}>
        <div className="flex gap-1 text-2xl">
          {t.header.decorEmojis.slice(0, 3).map((e, i) => (
            <span key={i} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>{e}</span>
          ))}
        </div>
        {selected && (
          <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="bg-white px-2 py-2">
        <p className="font-bold text-gray-900 text-sm leading-tight">{t.emoji} {t.name}</p>
        <p className="text-gray-400 text-xs mt-0.5">{t.ageRange}</p>
      </div>
    </button>
  )
}
