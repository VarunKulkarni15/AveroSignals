import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createProject } from './actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 bg-[#0a0a0a] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#24b47e] flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-semibold text-lg">PushHub Dashboard</h1>
        </div>
        <div className="text-sm text-zinc-400">{user.email}</div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Projects</h2>
          
          <form action={createProject} className="flex gap-2">
            <input 
              type="text" 
              name="name" 
              placeholder="Project Name..."
              required
              className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#24b47e] transition-colors"
            />
            <button 
              type="submit"
              className="bg-[#24b47e] text-black font-medium text-sm px-4 py-1.5 rounded-md hover:bg-[#209f6e] transition-colors"
            >
              New Project
            </button>
          </form>
        </div>

        {(!projects || projects.length === 0) ? (
          <div className="border border-zinc-800 border-dashed rounded-xl p-12 text-center bg-zinc-900/30">
            <p className="text-zinc-400 mb-2">You don't have any projects yet.</p>
            <p className="text-sm text-zinc-500">Create one above to get your Project ID and start sending notifications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/dashboard/${project.id}`}
                className="group block bg-[#111] border border-zinc-800 rounded-xl p-6 hover:border-[#24b47e] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(36,180,126,0.12)]"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#24b47e] transition-colors">{project.name}</h3>
                <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded w-fit mb-4">
                  ID: {project.id}
                </div>
                <div className="flex items-center text-sm text-zinc-400">
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
