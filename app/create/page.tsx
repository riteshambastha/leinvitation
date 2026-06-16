import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import CreateClient from './CreateClient'
import Nav from '@/components/Nav'

export default async function CreatePage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/create')

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav userEmail={user.email} />
      <CreateClient />
    </div>
  )
}
