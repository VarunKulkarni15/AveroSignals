import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import CreateProjectForm from './CreateProjectForm'

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

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('project_id')

  const subscriberCounts = (subscriptions || []).reduce((acc: any, sub: any) => {
    acc[sub.project_id] = (acc[sub.project_id] || 0) + 1;
    return acc;
  }, {});

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
    <div className="max-w-6xl mx-auto px-8 py-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Projects</h1>
          <p className="text-[#a1a1aa] text-sm">Manage your applications and broadcast push notifications.</p>
        </div>
        <CreateProjectForm createProject={createProject} />
      </div>

      {(!projects || projects.length === 0) ? (
          <div className="border border-border-main border-dashed rounded-xl p-12 text-center bg-bg-input/50">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full mx-auto mb-4 flex items-center justify-center border border-border-main">
              <svg className="w-8 h-8 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-[#ededed] font-medium mb-2">No projects yet</p>
            <p className="text-sm text-[#a1a1aa] max-w-md mx-auto">Create your first Avero Signals project to get your integration API keys and start sending notifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/${project.id}`}
                className="group flex flex-col bg-bg-card/80 backdrop-blur-sm border border-border-main rounded-xl overflow-hidden hover:border-[#666666] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(139,170,168,0.05)]"
              >
                <div className="p-3 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    {project.site_url ? (
                      <img 
                        src={project.icon_url || `https://www.google.com/s2/favicons?domain=${project.site_url}&sz=64`} 
                        alt="Project Icon" 
                        className="w-7 h-7 rounded-full border border-border-main bg-bg-main object-contain p-0.5"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A696C] to-[#2c3e40] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="bg-bg-input border border-border-main px-1.5 py-0.5 rounded text-[10px] font-mono text-[#a1a1aa] flex items-center gap-1 group-hover:text-[#8BAAA8] transition-colors">
                      ID: {project.id.split('-')[0]}...
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-[#ededed] mb-0.5">{project.name}</h3>
                  <div className="flex items-center text-[11px] text-[#a1a1aa] gap-1 mb-3">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {project.site_url ? project.site_url.replace(/^https?:\/\//, '') : 'No URL set'}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-bg-input rounded-lg p-2 border border-[#222222]">
                      <div className="text-[9px] text-[#666666] font-medium uppercase tracking-wider mb-0.5">Subscribers</div>
                      <div className="text-sm text-[#ededed] font-semibold">{subscriberCounts[project.id] || 0}</div>
                    </div>
                    <div className="bg-bg-input rounded-lg p-2 border border-[#222222]">
                      <div className="text-[9px] text-[#666666] font-medium uppercase tracking-wider mb-0.5">Broadcasts</div>
                      <div className="text-sm text-[#ededed] font-semibold">{project.broadcast_count || 0}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border-main bg-bg-input px-4 py-2 flex justify-between items-center group-hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-xs font-medium text-[#ededed]">Manage Project</span>
                  <svg className="w-4 h-4 text-[#666666] group-hover:text-[#8BAAA8] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
}
