import { Resend } from 'resend'
import type { Event } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? 'invites@bdayinvite.app'

// ---- Invite email sent to each guest ----
export async function sendInviteEmail({
  event,
  guestName,
  guestEmail,
}: {
  event: Event
  guestName: string
  guestEmail: string
}) {
  const rsvpUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event.id}`
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: guestEmail,
    subject: `${event.cover_emoji} You're invited to ${event.title}!`,
    html: inviteEmailHtml({ event, guestName, rsvpUrl, eventDate }),
  })

  if (error) throw error
  return data
}

// ---- Reminder email ----
export async function sendReminderEmail({
  event,
  guestName,
  guestEmail,
}: {
  event: Event
  guestName: string
  guestEmail: string
}) {
  const rsvpUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event.id}`
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: guestEmail,
    subject: `⏰ Reminder: ${event.title} is coming up!`,
    html: reminderEmailHtml({ event, guestName, rsvpUrl, eventDate }),
  })

  if (error) throw error
  return data
}

// ---- Host confirmation email ----
export async function sendHostConfirmationEmail({
  event,
  dashboardUrl,
}: {
  event: Event
  dashboardUrl: string
}) {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: event.host_email,
    subject: `${event.cover_emoji} Your invite for "${event.title}" is ready!`,
    html: hostConfirmationHtml({ event, dashboardUrl, eventDate }),
  })

  if (error) throw error
  return data
}

// ---- RSVP notification to host ----
export async function sendRsvpNotification({
  event,
  guestName,
  rsvpStatus,
  plusOnes,
  message,
  dashboardUrl,
}: {
  event: Event
  guestName: string
  rsvpStatus: string
  plusOnes: number
  message?: string
  dashboardUrl: string
}) {
  const statusEmoji = rsvpStatus === 'attending' ? '✅' : rsvpStatus === 'maybe' ? '🤔' : '❌'
  const statusText = rsvpStatus === 'attending' ? 'is coming!' : rsvpStatus === 'maybe' ? 'might come' : "can't make it"

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: event.host_email,
    subject: `${statusEmoji} ${guestName} ${statusText} — ${event.title}`,
    html: rsvpNotificationHtml({ event, guestName, rsvpStatus, plusOnes, message, dashboardUrl }),
  })

  if (error) throw error
  return data
}

// ================================================================
// HTML Templates
// ================================================================

function baseWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#f9f0ff; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  .container { max-width:560px; margin:40px auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#9333ea,#ec4899); padding:48px 40px; text-align:center; color:#fff; }
  .header .emoji { font-size:64px; display:block; margin-bottom:16px; }
  .header h1 { margin:0; font-size:28px; font-weight:700; }
  .header p { margin:8px 0 0; opacity:.85; font-size:16px; }
  .body { padding:36px 40px; }
  .detail-row { display:flex; gap:12px; align-items:flex-start; margin-bottom:14px; }
  .detail-icon { font-size:20px; width:28px; flex-shrink:0; }
  .detail-text { font-size:15px; color:#374151; line-height:1.5; }
  .detail-label { font-weight:600; color:#111827; }
  .cta { display:block; margin:32px 0 0; text-align:center; }
  .cta a { display:inline-block; padding:16px 40px; background:linear-gradient(135deg,#9333ea,#ec4899); color:#fff !important; text-decoration:none; border-radius:12px; font-weight:700; font-size:17px; }
  .footer { padding:24px 40px; text-align:center; font-size:13px; color:#9ca3af; border-top:1px solid #f3f4f6; }
  .message-box { background:#f9f0ff; border-left:4px solid #9333ea; padding:16px 20px; border-radius:0 12px 12px 0; margin:24px 0; font-style:italic; color:#4b5563; }
</style>
</head>
<body>
<div class="container">
${content}
</div>
</body>
</html>`
}

function inviteEmailHtml({ event, guestName, rsvpUrl, eventDate }: {
  event: Event, guestName: string, rsvpUrl: string, eventDate: string
}) {
  return baseWrapper(`
  <div class="header">
    <span class="emoji">${event.cover_emoji}</span>
    <h1>${event.title}</h1>
    <p>You're invited, ${guestName}!</p>
  </div>
  <div class="body">
    <div class="detail-row"><span class="detail-icon">📅</span><span class="detail-text"><span class="detail-label">When</span><br>${eventDate} at ${event.time}</span></div>
    <div class="detail-row"><span class="detail-icon">📍</span><span class="detail-text"><span class="detail-label">Where</span><br>${event.venue}${event.venue_address ? `<br><small>${event.venue_address}</small>` : ''}</span></div>
    <div class="detail-row"><span class="detail-icon">🎉</span><span class="detail-text"><span class="detail-label">Hosted by</span><br>${event.host_name}</span></div>
    ${event.description ? `<div class="message-box">${event.description}</div>` : ''}
    <div class="cta"><a href="${rsvpUrl}">RSVP Now →</a></div>
  </div>
  <div class="footer">Sent via BdayInvite — free birthday invitations forever 🎂</div>`)
}

function reminderEmailHtml({ event, guestName, rsvpUrl, eventDate }: {
  event: Event, guestName: string, rsvpUrl: string, eventDate: string
}) {
  return baseWrapper(`
  <div class="header">
    <span class="emoji">⏰</span>
    <h1>Don't forget!</h1>
    <p>${event.title} is coming up</p>
  </div>
  <div class="body">
    <p style="font-size:16px;color:#374151">Hey ${guestName}, just a friendly reminder that <strong>${event.host_name}</strong> is expecting you!</p>
    <div class="detail-row"><span class="detail-icon">📅</span><span class="detail-text"><span class="detail-label">When</span><br>${eventDate} at ${event.time}</span></div>
    <div class="detail-row"><span class="detail-icon">📍</span><span class="detail-text"><span class="detail-label">Where</span><br>${event.venue}${event.venue_address ? `<br><small>${event.venue_address}</small>` : ''}</span></div>
    <div class="cta"><a href="${rsvpUrl}">Update your RSVP →</a></div>
  </div>
  <div class="footer">Sent via BdayInvite — free birthday invitations forever 🎂</div>`)
}

function hostConfirmationHtml({ event, dashboardUrl, eventDate }: {
  event: Event, dashboardUrl: string, eventDate: string
}) {
  return baseWrapper(`
  <div class="header">
    <span class="emoji">${event.cover_emoji}</span>
    <h1>Your invite is live!</h1>
    <p>${event.title}</p>
  </div>
  <div class="body">
    <p style="font-size:16px;color:#374151">Hey ${event.host_name}! Your birthday invite is ready to share. Here's what's set up:</p>
    <div class="detail-row"><span class="detail-icon">📅</span><span class="detail-text"><span class="detail-label">Date</span><br>${eventDate} at ${event.time}</span></div>
    <div class="detail-row"><span class="detail-icon">📍</span><span class="detail-text"><span class="detail-label">Venue</span><br>${event.venue}</span></div>
    <p style="font-size:15px;color:#374151;margin-top:24px;"><strong>Bookmark your dashboard</strong> — this is the private link to see RSVPs and manage guests:</p>
    <div class="cta"><a href="${dashboardUrl}">Open My Dashboard →</a></div>
    <p style="font-size:13px;color:#6b7280;text-align:center;margin-top:16px;">Keep this link safe — anyone with it can see your guest list.</p>
  </div>
  <div class="footer">Sent via BdayInvite — free birthday invitations forever 🎂</div>`)
}

function rsvpNotificationHtml({ event, guestName, rsvpStatus, plusOnes, message, dashboardUrl }: {
  event: Event, guestName: string, rsvpStatus: string, plusOnes: number, message?: string, dashboardUrl: string
}) {
  const statusEmoji = rsvpStatus === 'attending' ? '✅' : rsvpStatus === 'maybe' ? '🤔' : '❌'
  const statusText = rsvpStatus === 'attending' ? 'is coming' : rsvpStatus === 'maybe' ? 'might come' : "can't make it"
  return baseWrapper(`
  <div class="header">
    <span class="emoji">${statusEmoji}</span>
    <h1>New RSVP!</h1>
    <p>${guestName} ${statusText}</p>
  </div>
  <div class="body">
    <div class="detail-row"><span class="detail-icon">👤</span><span class="detail-text"><span class="detail-label">Guest</span><br>${guestName}</span></div>
    <div class="detail-row"><span class="detail-icon">🎟️</span><span class="detail-text"><span class="detail-label">Status</span><br>${statusText.charAt(0).toUpperCase() + statusText.slice(1)}</span></div>
    ${plusOnes > 0 ? `<div class="detail-row"><span class="detail-icon">👥</span><span class="detail-text"><span class="detail-label">+1s</span><br>Bringing ${plusOnes} extra guest${plusOnes > 1 ? 's' : ''}</span></div>` : ''}
    ${message ? `<div class="message-box">"${message}"</div>` : ''}
    <div class="cta"><a href="${dashboardUrl}">View all RSVPs →</a></div>
  </div>
  <div class="footer">Sent via BdayInvite 🎂</div>`)
}
