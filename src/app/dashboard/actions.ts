'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check project limit
  const { count, error: countError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (countError) {
    console.error('Failed to count projects:', countError);
    throw new Error('Failed to verify project limits');
  }

  if (count !== null && count >= 3) {
    throw new Error('You have reached the maximum limit of 3 projects per account. Please upgrade to Pro or delete an existing project.');
  }

  const name = formData.get('name') as string

  // Insert project (forcing secret_api_key to null to save storage)
  const { data, error } = await supabase.from('projects').insert({
    user_id: user.id,
    name: name,
    secret_api_key: null
  }).select().single()

  if (error) {
    console.error('Failed to create project:', error)
    throw new Error('Failed to create project')
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function generateApiKey(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const newKey = crypto.randomUUID()

  const { error } = await supabase
    .from('projects')
    .update({ secret_api_key: newKey })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Failed to generate API key:', error)
    return { error: 'Failed to generate API key' }
  }

  revalidatePath(`/dashboard/${projectId}`)
  return { success: true, key: newKey }
}
