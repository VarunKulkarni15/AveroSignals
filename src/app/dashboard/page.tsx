import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import CreateProjectForm from './CreateProjectForm'
import UserDropdown from '@/components/UserDropdown'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  async function createProject(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const siteUrl = formData.get('site_url') as string
    
    if (!name?.trim() || !siteUrl?.trim()) return
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('projects').insert({ 
        name, 
        site_url: siteUrl,
        user_id: user.id 
      })
      revalidatePath('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-[#4A696C]/30">
      <header className="border-b border-[#333333] bg-[#000000] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#333333] bg-[#111111] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-medium text-lg tracking-wide text-white">PushHub Dashboard</h1>
        </div>
        <UserDropdown email={user!.email!} />
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-white">Your Projects</h2>
          <CreateProjectForm createProject={createProject} />
        </div>

        {(!projects || projects.length === 0) ? (
          <div className="border border-[#333333] border-dashed rounded-xl p-12 text-center bg-[#111111]/50">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full mx-auto mb-4 flex items-center justify-center border border-[#333333]">
              <svg className="w-8 h-8 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-[#ededed] font-medium mb-2">No projects yet</p>
            <p className="text-sm text-[#a1a1aa] max-w-md mx-auto">Create your first PushHub project to get your integration API keys and start sending notifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/${project.id}`}
                className="group flex flex-col bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden hover:border-[#666666] transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    {project.site_url ? (
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${project.site_url}&sz=64`} 
                        alt="Project Icon" 
                        className="w-10 h-10 rounded-full border border-[#333333] bg-[#000000] object-contain p-1"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A696C] to-[#2c3e40] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="bg-[#111111] border border-[#333333] px-2 py-1 rounded text-xs font-mono text-[#a1a1aa] flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                      ID: {project.id.split('-')[0]}...
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-[#ededed] mb-1">{project.name}</h3>
                  <div className="flex items-center text-sm text-[#a1a1aa] gap-1.5 mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {project.site_url ? project.site_url.replace(/^https?:\/\//, '') : 'No URL set'}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111111] rounded-lg p-3 border border-[#222222]">
                      <div className="text-xs text-[#666666] font-medium uppercase tracking-wider mb-1">Subscribers</div>
                      <div className="text-xl text-[#ededed] font-semibold">0</div>
                    </div>
                    <div className="bg-[#111111] rounded-lg p-3 border border-[#222222]">
                      <div className="text-xs text-[#666666] font-medium uppercase tracking-wider mb-1">Broadcasts</div>
                      <div className="text-xl text-[#ededed] font-semibold">0</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[#333333] bg-[#111111] px-6 py-3 flex justify-between items-center group-hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-sm font-medium text-[#ededed]">Manage Project</span>
                  <svg className="w-4 h-4 text-[#666666] group-hover:text-[#ededed] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
