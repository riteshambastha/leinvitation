import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Envelope body */}
        <div style={{ position: 'relative', display: 'flex' }}>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
            {/* Envelope back */}
            <rect x="0" y="2" width="20" height="14" rx="2" fill="white" opacity="0.9"/>
            {/* Envelope flap */}
            <path d="M0 4 L10 10 L20 4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
            {/* Heart */}
            <path
              d="M10 5.5 C10 5.5 8 3.5 6.5 4 C5 4.5 5 6.5 6.5 7.5 L10 10 L13.5 7.5 C15 6.5 15 4.5 13.5 4 C12 3.5 10 5.5 10 5.5Z"
              fill="#f472b6"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  )
}
