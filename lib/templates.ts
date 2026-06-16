export interface InviteTemplate {
  id: string
  name: string
  emoji: string
  description: string
  tags: ('boys' | 'girls' | 'all')[]
  ageRange: string

  // Header banner on the RSVP page
  header: {
    background: string     // CSS background (gradient + pattern)
    overlay?: string       // optional second CSS background layer (SVG pattern)
    textColor: string
    decorEmojis: string[]  // scattered decorative emojis
    tagline: string        // shown under the event title
  }

  // Accent used for buttons and highlights
  button: {
    background: string
    hover: string
    text: string
  }

  // Mini preview card in the template picker
  preview: {
    background: string
    border: string
  }
}

export const TEMPLATES: InviteTemplate[] = [
  // ── 🎂 Classic Birthday ─────────────────────────────────────────────────
  {
    id: 'birthday',
    name: 'Classic Birthday',
    emoji: '🎂',
    description: 'Timeless and festive — perfect for any age',
    tags: ['all'],
    ageRange: 'All ages',
    header: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f59e0b 100%)',
      decorEmojis: ['🎂', '🎉', '🎈', '🎁', '🎊', '✨', '🥳', '🎀'],
      textColor: '#ffffff',
      tagline: "It's party time!",
    },
    button: { background: '#7c3aed', hover: '#6d28d9', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
      border: '#7c3aed',
    },
  },

  // ── 🍌 Minions ───────────────────────────────────────────────────────────
  {
    id: 'minions',
    name: 'Minions',
    emoji: '🍌',
    description: 'Banana! A fan favourite for little ones',
    tags: ['all'],
    ageRange: '3–8 years',
    header: {
      background: '#FFD700',
      overlay: [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23005B99' stroke-width='8'/%3E%3Cellipse cx='30' cy='35' rx='8' ry='10' fill='%23005B99'/%3E%3Cellipse cx='50' cy='35' rx='8' ry='10' fill='%23005B99'/%3E%3Ccircle cx='30' cy='35' r='4' fill='white'/%3E%3Ccircle cx='50' cy='35' r='4' fill='white'/%3E%3C/svg%3E\")",
        'repeating-linear-gradient(0deg, transparent 0px, transparent 56px, #005B9922 56px, #005B9922 60px)',
      ].join(', '),
      textColor: '#005B99',
      decorEmojis: ['🍌', '🥸', '😄', '💛', '🍌', '👓', '🍌', '😁'],
      tagline: 'BANANA! You\'re invited!',
    },
    button: { background: '#005B99', hover: '#004a80', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(180deg, #FFD700 60%, #005B99 60%)',
      border: '#FFD700',
    },
  },

  // ── 🕷️ Spider-Man ────────────────────────────────────────────────────────
  {
    id: 'spiderman',
    name: 'Spider-Man',
    emoji: '🕷️',
    description: 'Your friendly neighbourhood birthday hero',
    tags: ['boys'],
    ageRange: '3–10 years',
    header: {
      background: [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ccircle cx='100' cy='100' r='90' fill='none' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Cline x1='10' y1='100' x2='190' y2='100' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Cline x1='100' y1='10' x2='100' y2='190' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Cline x1='36' y1='36' x2='164' y2='164' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3Cline x1='164' y1='36' x2='36' y2='164' stroke='white' stroke-width='1.5' opacity='0.25'/%3E%3C/svg%3E\")",
        'linear-gradient(135deg, #C1111F 0%, #C1111F 55%, #0A2196 55%)',
      ].join(', '),
      textColor: '#ffffff',
      decorEmojis: ['🕷️', '🕸️', '⚡', '💥', '🦸', '🕷️', '🕸️', '💫'],
      tagline: 'With great power comes a great party!',
    },
    button: { background: '#C1111F', hover: '#a30f1a', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(135deg, #C1111F 55%, #0A2196 55%)',
      border: '#C1111F',
    },
  },

  // ── ⛏️ Minecraft ─────────────────────────────────────────────────────────
  {
    id: 'minecraft',
    name: 'Minecraft',
    emoji: '⛏️',
    description: 'Let\'s build a birthday party!',
    tags: ['boys', 'girls'],
    ageRange: '5–10 years',
    header: {
      background: [
        'repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 32px)',
        'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 32px)',
        'linear-gradient(180deg, #5D8731 0%, #5D8731 35%, #8B5E3C 35%, #8B5E3C 70%, #6B4423 70%)',
      ].join(', '),
      textColor: '#ffffff',
      decorEmojis: ['⛏️', '🌲', '💎', '🧱', '🐷', '🍄', '⛏️', '🌾'],
      tagline: 'Time to mine some birthday fun!',
    },
    button: { background: '#5D8731', hover: '#4a6d26', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(180deg, #5D8731 40%, #8B5E3C 40%)',
      border: '#5D8731',
    },
  },

  // ── 🎮 Roblox ────────────────────────────────────────────────────────────
  {
    id: 'roblox',
    name: 'Roblox',
    emoji: '🎮',
    description: 'Join the party — no robux needed!',
    tags: ['boys', 'girls'],
    ageRange: '5–10 years',
    header: {
      background: [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='none'/%3E%3Crect x='5' y='5' width='20' height='20' rx='3' fill='white' opacity='0.08'/%3E%3Crect x='35' y='35' width='20' height='20' rx='3' fill='white' opacity='0.08'/%3E%3C/svg%3E\")",
        'linear-gradient(135deg, #CC0000 0%, #FF0000 40%, #CC0000 100%)',
      ].join(', '),
      textColor: '#ffffff',
      decorEmojis: ['🎮', '👾', '🏆', '⚔️', '🧱', '🎮', '💥', '🕹️'],
      tagline: "Player 1 is turning a new level!",
    },
    button: { background: '#CC0000', hover: '#aa0000', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(135deg, #CC0000, #FF4444)',
      border: '#CC0000',
    },
  },

  // ── ⚔️ Demon Slayer ──────────────────────────────────────────────────────
  {
    id: 'demonslayer',
    name: 'Demon Slayer',
    emoji: '⚔️',
    description: 'Total Concentration: Birthday breathing!',
    tags: ['boys', 'girls'],
    ageRange: '6–10 years',
    header: {
      background: [
        'repeating-conic-gradient(#1a472a 0% 25%, #0d1117 0% 50%) 0 0 / 40px 40px',
      ].join(', '),
      overlay: 'linear-gradient(180deg, rgba(139,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)',
      textColor: '#ffffff',
      decorEmojis: ['⚔️', '🌸', '🌊', '⚡', '🔥', '💫', '🌙', '🗡️'],
      tagline: 'Total Concentration: Party Breathing!',
    },
    button: { background: '#8B0000', hover: '#6b0000', text: '#ffffff' },
    preview: {
      background: 'repeating-conic-gradient(#1a472a 0% 25%, #0d1117 0% 50%) 0 0 / 24px 24px',
      border: '#8B0000',
    },
  },

  // ── 👑 Princess ──────────────────────────────────────────────────────────
  {
    id: 'princess',
    name: 'Princess',
    emoji: '👑',
    description: 'A royal celebration fit for a princess',
    tags: ['girls'],
    ageRange: '2–8 years',
    header: {
      background: [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ctext x='20' y='28' text-anchor='middle' font-size='20' opacity='0.12'%3E✦%3C/text%3E%3C/svg%3E\")",
        'linear-gradient(135deg, #FF69B4 0%, #DA70D6 50%, #FFD700 100%)',
      ].join(', '),
      textColor: '#ffffff',
      decorEmojis: ['👑', '💎', '🌸', '✨', '🦋', '💖', '👸', '🌟'],
      tagline: 'Her Royal Highness is turning older!',
    },
    button: { background: '#DA70D6', hover: '#c55dc5', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(135deg, #FF69B4, #DA70D6, #FFD700)',
      border: '#DA70D6',
    },
  },

  // ── 🦄 Unicorn ───────────────────────────────────────────────────────────
  {
    id: 'unicorn',
    name: 'Unicorn',
    emoji: '🦄',
    description: 'Magical, sparkly & impossibly fun',
    tags: ['girls'],
    ageRange: '2–8 years',
    header: {
      background: [
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='3' fill='white' opacity='0.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='white' opacity='0.2'/%3E%3Ccircle cx='50' cy='50' r='2' fill='white' opacity='0.2'/%3E%3Ccircle cx='50' cy='10' r='1.5' fill='white' opacity='0.15'/%3E%3Ccircle cx='10' cy='50' r='1.5' fill='white' opacity='0.15'/%3E%3C/svg%3E\")",
        'linear-gradient(135deg, #FFB3C6 0%, #C9B3FF 33%, #B3D9FF 66%, #B3FFE4 100%)',
      ].join(', '),
      textColor: '#5b21b6',
      decorEmojis: ['🦄', '🌈', '✨', '💜', '🌸', '⭐', '🌟', '💫'],
      tagline: 'Magical birthday wishes are coming true!',
    },
    button: { background: '#a855f7', hover: '#9333ea', text: '#ffffff' },
    preview: {
      background: 'linear-gradient(135deg, #FFB3C6, #C9B3FF, #B3D9FF, #B3FFE4)',
      border: '#a855f7',
    },
  },
]

export function getTemplate(id: string): InviteTemplate {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}
