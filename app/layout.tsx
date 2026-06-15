import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BdayInvite — Free birthday invitations & RSVP',
  description: 'Create beautiful birthday invitations, collect RSVPs, and manage your guest list — for free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {children}
      </body>
    </html>
  )
}
