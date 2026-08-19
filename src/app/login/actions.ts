'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // If email confirmation is required, they won't have a session yet
  if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
    return { error: 'Account already exists. Please sign in.' }
  }

  // Supabase might require email confirmation by default
  return { success: 'Check your email to confirm your account, then sign in.' }
}
