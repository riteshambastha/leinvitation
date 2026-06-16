import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Le` Invitation — Beautiful birthday invitations, free forever',
  description: 'Create stunning themed birthday invitations, share a link, collect RSVPs, and manage your guest list — completely free.',
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
