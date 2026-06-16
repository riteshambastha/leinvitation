'use client'

import { useState, useRef } from 'react'
import { BANNERS, getBannersForTemplate, type BannerMeta } from '@/lib/banners'

interface BannerPickerProps {
  templateId: string
  selectedBannerId: string | null
  customBannerUrl: string | null
  onSelect: (bannerId: string | null, customUrl: string | null) => void
}

export default function BannerPicker({
  templateId,
  selectedBannerId,
  customBannerUrl,
  onSelect,
}: BannerPickerProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const themebanners = getBannersForTemplate(templateId)
  const otherBanners = showAll
    ? BANNERS.filter(b => b.templateId !== templateId)
    : []

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB')
      return
    }
    setUploadError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload-banner', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onSelect(null, data.url)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function isSelected(b: BannerMeta) {
    return selectedBannerId === b.id && !customBannerUrl
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
        Choose a banner for your invite
      </p>

      {/* Theme banners */}
      <div className="grid grid-cols-2 gap-3">
        {themebanners.map(b => (
          <BannerCard
            key={b.id}
            banner={b}
            selected={isSelected(b)}
            onClick={() => onSelect(b.id, null)}
          />
        ))}
      </div>

      {/* Show all themes toggle */}
      {!showAll ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full text-sm text-purple-600 font-medium py-2 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          Browse all themes →
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">All themes</p>
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {otherBanners.map(b => (
              <BannerCard
                key={b.id}
                banner={b}
                selected={isSelected(b)}
                onClick={() => onSelect(b.id, null)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ↑ Show less
          </button>
        </div>
      )}

      {/* Upload divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200"/>
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-200"/>
      </div>

      {/* Upload area */}
      <div>
        {customBannerUrl ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={customBannerUrl} alt="Custom banner" className="w-full h-28 object-cover"/>
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-100"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onSelect(themebanners[0]?.id ?? null, null)}
                className="bg-white text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
              Custom ✓
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-2xl py-6 flex flex-col items-center gap-2 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"/>
                <span className="text-sm text-gray-500">Uploading…</span>
              </>
            ) : (
              <>
                <span className="text-3xl">📸</span>
                <span className="text-sm font-medium text-gray-600">Upload your own image</span>
                <span className="text-xs text-gray-400">JPG, PNG or GIF · Max 5 MB</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        {uploadError && (
          <p className="text-red-500 text-sm mt-2">{uploadError}</p>
        )}
      </div>
    </div>
  )
}

function BannerCard({
  banner,
  selected,
  onClick,
}: {
  banner: BannerMeta
  selected: boolean
  onClick: () => void
}) {
  const { Component } = banner
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden border-2 transition-all shadow-sm hover:shadow-md ${
        selected
          ? 'border-purple-500 ring-2 ring-purple-300'
          : 'border-transparent hover:border-purple-300'
      }`}
    >
      <Component className="w-full h-20 object-cover"/>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
        <span className="text-white text-xs font-medium">{banner.name}</span>
      </div>
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      )}
    </button>
  )
}
