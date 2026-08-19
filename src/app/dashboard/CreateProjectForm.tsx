'use client'

import { useState } from 'react'

export default function CreateProjectForm({ createProject }: { createProject: (formData: FormData) => Promise<void> }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    if (!name.trim()) {
      setError('Please enter a project name')
      return
    }

    setLoading(true)
    try {
      await createProject(formData)
      // reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1 relative" noValidate>
      <div className="flex gap-2">
        <input 
          type="text" 
          name="name" 
          placeholder="Project Name..."
          className={`bg-[#111111] border ${error ? 'border-red-500/50' : 'border-[#333333]'} rounded-md px-3 py-1.5 text-sm text-[#ededed] focus:outline-none focus:border-[#8BAAA8] transition-colors`}
        />
        <button 
          type="submit"
          disabled={loading}
          className={`bg-[#111111] text-[#ededed] font-medium text-sm px-4 py-1.5 rounded-md border border-[#333333] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#8BAAA8] hover:text-[#8BAAA8]'}`}
        >
          {loading ? 'Creating...' : 'New Project'}
        </button>
      </div>
      {error && <span className="absolute top-full right-0 mt-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{error}</span>}
    </form>
  )
}
