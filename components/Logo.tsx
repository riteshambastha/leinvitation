import Link from 'next/link'

// ── SVG icon mark ────────────────────────────────────────────────────────────
export function LogoIcon({ size = 40 }: { size?: number }) {
  const id = `logo-${size}` // unique gradient id per size to avoid SVG conflicts
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#db2777"/>
        </linearGradient>
        <linearGradient id={`${id}-heart`} x1="22" y1="14" x2="22" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fda4af"/>
          <stop offset="1" stopColor="#f43f5e"/>
        </linearGradient>
      </defs>

      {/* Background squircle */}
      <rect x="1" y="1" width="42" height="42" rx="13" fill={`url(#${id}-bg)`}/>

      {/* Envelope body */}
      <rect x="9" y="15" width="26" height="18" rx="3" fill="white" opacity="0.95"/>

      {/* Envelope fold lines */}
      <path d="M9 15 L22 24.5 L35 15" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 33 L17 25" stroke="rgba(124,58,237,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M35 33 L27 25" stroke="rgba(124,58,237,0.2)" strokeWidth="1.2" strokeLinecap="round"/>

      {/* Heart seal */}
      <path
        d="M22,26.5 C22,26.5 15.5,21.5 15.5,18 C15.5,15.5 17.5,14 19.5,15 C20.5,15.5 21.2,16.3 22,17.2 C22.8,16.3 23.5,15.5 24.5,15 C26.5,14 28.5,15.5 28.5,18 C28.5,21.5 22,26.5 22,26.5Z"
        fill={`url(#${id}-heart)`}
      />

      {/* Sparkle — top right corner */}
      <path
        d="M35.5 6.5 L36.4 9.3 L39.2 10.2 L36.4 11.1 L35.5 13.9 L34.6 11.1 L31.8 10.2 L34.6 9.3 Z"
        fill="white" opacity="0.8"
      />

      {/* Small decorative dots */}
      <circle cx="7.5" cy="7.5" r="1.8" fill="white" opacity="0.45"/>
      <circle cx="38" cy="37" r="1.4" fill="white" opacity="0.35"/>
      <circle cx="6.5" cy="37.5" r="1" fill="white" opacity="0.3"/>
    </svg>
  )
}

// ── Wordmark text ────────────────────────────────────────────────────────────
export function LogoWordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm:  { le: 'text-lg',  inv: 'text-sm' },
    md:  { le: 'text-xl',  inv: 'text-base' },
    lg:  { le: 'text-3xl', inv: 'text-2xl' },
    xl:  { le: 'text-5xl', inv: 'text-4xl' },
  }
  const s = sizes[size]

  return (
    <span className={`${s.le} font-black tracking-tight leading-none select-none`} style={{ letterSpacing: '-0.01em' }}>
      <span style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Le
      </span>
      <span style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontStyle: 'italic',
        fontWeight: 400,
      }}>`</span>
      <span className={`${s.inv} font-semibold`} style={{ color: '#374151' }}>Invitation</span>
    </span>
  )
}

// ── Full logo (icon + wordmark) — for nav ────────────────────────────────────
export function Logo({
  href,
  iconSize = 32,
  wordSize = 'md',
}: {
  href?: string
  iconSize?: number
  wordSize?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <LogoIcon size={iconSize}/>
      <LogoWordmark size={wordSize}/>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center gap-2.5 no-underline hover:opacity-90 transition-opacity">
        <LogoIcon size={iconSize}/>
        <LogoWordmark size={wordSize}/>
      </Link>
    )
  }
  return content
}

// ── Stacked logo — for auth / landing pages ───────────────────────────────────
export function LogoStacked() {
  return (
    <Link href="/" className="inline-flex flex-col items-center gap-3 no-underline hover:opacity-90 transition-opacity">
      <LogoIcon size={64}/>
      <LogoWordmark size="lg"/>
    </Link>
  )
}
