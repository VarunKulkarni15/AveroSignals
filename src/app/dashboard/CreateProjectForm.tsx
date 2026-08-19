'use client'

import { useState } from 'react'

export default function CreateProjectForm({ createProject }: { createProject: (formData: FormData) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const siteUrl = formData.get('site_url') as string
    
    if (!name.trim() || !siteUrl.trim()) {
      setError('Please fill out all fields')
      return
    }

    setLoading(true)
    try {
      await createProject(formData)
      setIsOpen(false) // Close modal on success
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#ededed] text-[#000000] font-medium text-sm px-4 py-2 rounded-md hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-input border border-border-main rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border-main flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Create New Project</h3>
              <button onClick={() => setIsOpen(false)} className="text-[#a1a1aa] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Project Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. My Portfolio"
                  className={`w-full bg-bg-main border ${error.includes('fields') ? 'border-red-500/50' : 'border-border-main'} rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Site URL</label>
                <input 
                  type="url" 
                  name="site_url" 
                  placeholder="https://example.com"
                  className={`w-full bg-bg-main border ${error.includes('fields') ? 'border-red-500/50' : 'border-border-main'} rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#8BAAA8] transition-all`}
                />
                <p className="text-xs text-zinc-500 mt-2">The domain where you will install the PushHub script.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md mt-4">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-transparent border border-border-main text-[#ededed] font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-[#ededed] text-[#000000] font-medium text-sm px-4 py-2.5 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
