export type Theme = 'confetti' | 'elegant' | 'garden' | 'retro' | 'minimal'

export interface Event {
  id: string
  host_name: string
  host_email: string
  title: string
  date: string           // ISO date string
  time: string           // e.g. "18:30"
  venue: string
  venue_address?: string
  description?: string
  theme: Theme
  template_id: string
  cover_emoji: string
  max_guests?: number
  plus_ones_allowed: boolean
  message_prompt?: string
  dashboard_token: string  // secret token for host to access dashboard
  user_id?: string
  banner_id?: string        // library banner id (e.g. 'minions-banana')
  banner_url?: string       // custom uploaded banner image URL
  child_photo_url?: string  // optional child portrait shown on the card
  created_at: string
}

export interface Guest {
  id: string
  event_id: string
  name: string
  email: string
  phone?: string
  rsvp_status: 'attending' | 'not_attending' | 'maybe'
  plus_one_count: number  // legacy: total extras (adults-1 + kids)
  adult_count: number     // how many adults (including the RSVP'er), min 1
  kids_count: number      // how many kids/siblings
  message?: string
  invited_at?: string   // when host sent invite email
  rsvped_at: string
}

export type CreateEventInput = Omit<Event, 'id' | 'dashboard_token' | 'created_at'>
export type CreateGuestInput = Omit<Guest, 'id' | 'invited_at' | 'rsvped_at'>
