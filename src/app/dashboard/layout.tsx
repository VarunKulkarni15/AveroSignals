import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

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
    <div className="min-h-screen bg-[#000000] bg-[radial-gradient(ellipse_at_top_left,#1c3031_0%,transparent_60%)] text-[#ededed] font-sans flex">
      {/* Global Sidebar */}
      <Sidebar email={user.email!} avatarUrl={user.user_metadata?.avatar_url} />

      {/* Main Content Area (offset by the sidebar width logic via flex-1 and ml-16 to guarantee no overlap on narrow collapse) */}
      <main className="flex-1 ml-16 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
