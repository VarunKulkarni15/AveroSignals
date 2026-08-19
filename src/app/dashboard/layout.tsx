import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import UserDropdown from '@/components/UserDropdown'
import ThemeTweaker from '@/components/ThemeTweaker'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-main text-[#ededed] font-sans flex">
      {/* Global Sidebar */}
      <Sidebar email={user.email!} avatarUrl={user.user_metadata?.avatar_url} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ThemeTweaker />
    </div>
  )
}
