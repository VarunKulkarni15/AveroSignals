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

  async function createProject(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    if (!name?.trim()) return
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('projects').insert({ name, user_id: user.id })
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
        <div className="text-sm text-[#a1a1aa]">{user!.email}</div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium text-white">Your Projects</h2>
          <CreateProjectForm createProject={createProject} />
        </div>

        {(!projects || projects.length === 0) ? (
          <div className="border border-[#333333] border-dashed rounded-xl p-12 text-center bg-[#111111]/50">
            <p className="text-[#a1a1aa] mb-2">You don't have any projects yet.</p>
            <p className="text-sm text-[#666666]">Create one above to get your Project ID and start sending notifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/${project.id}`}
                className="group block bg-[#111111] border border-[#333333] rounded-xl p-6 hover:border-[#8BAAA8] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(139,170,168,0.1)]"
              >
                <h3 className="text-lg font-medium mb-2 text-white group-hover:text-[#8BAAA8] transition-colors">{project.name}</h3>
                <div className="text-xs font-mono text-[#a1a1aa] bg-[#000000] border border-[#333333] px-2 py-1 rounded w-fit mb-4">
                  ID: {project.id}
                </div>
                <div className="flex items-center text-sm text-[#666666] group-hover:text-[#a1a1aa] transition-colors">
                  <span>Manage Broadcasts →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
