'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name: name,
  })

  if (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }

  revalidatePath('/dashboard')
}
