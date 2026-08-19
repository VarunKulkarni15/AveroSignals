'use client'

import { login, signup, signInWithGoogle, signInWithGithub } from './actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = isSignUp ? await signup(formData) : await login(formData);
      
      if (response?.error) {
        setValidationError(response.error);
      } else if (response?.success) {
        setSuccessMessage(response.success);
        setIsSignUp(false); // Switch back to login after signup
      }
    } catch (err) {
      // In Next.js, redirect() inside a server action throws an error that is caught here.
      // We can ignore it because Next.js handles the redirect automatically.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] flex flex-col items-center justify-center p-4 selection:bg-[#4A696C]/30">
      
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-8 h-8 rounded border border-[#333333] bg-[#111111] flex items-center justify-center group-hover:border-[#8BAAA8] transition-colors">
          <svg className="w-4 h-4 text-[#8BAAA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <span className="font-medium text-lg tracking-wide text-white group-hover:text-[#8BAAA8] transition-colors">PushHub</span>
      </Link>

      <div className="w-full max-w-[400px] bg-[#111111] border border-[#333333] rounded-lg p-8 shadow-2xl">
        <h2 className="text-xl font-medium text-white mb-6">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        
        <div className="flex flex-col gap-4 mb-6">
          <button 
            type="button"
            disabled={isGoogleLoading || isGithubLoading}
            onClick={async () => { 
              setIsGoogleLoading(true);
              await signInWithGoogle(); 
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-md border border-[#333333] bg-[#0a0a0a] hover:border-[#8BAAA8] hover:shadow-[0_0_15px_rgba(139,170,168,0.15)] text-[#ededed] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-500 border-t-[#8BAAA8] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>
          
          <button 
            type="button"
            disabled={isGoogleLoading || isGithubLoading}
            onClick={async () => { 
              setIsGithubLoading(true);
              await signInWithGithub(); 
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-md border border-[#333333] bg-[#0a0a0a] hover:border-[#8BAAA8] hover:shadow-[0_0_15px_rgba(139,170,168,0.15)] text-[#ededed] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGithubLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-500 border-t-[#8BAAA8] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            )}
            {isGithubLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-[#333333]" />
          <span className="text-xs text-[#a1a1aa] uppercase tracking-wider">Or</span>
          <hr className="flex-1 border-[#333333]" />
        </div>

        <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5" htmlFor="email">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full bg-[#000000] border ${validationError.includes('email') ? 'border-red-500/50' : 'border-[#333333]'} rounded-md px-3 py-2 text-sm text-[#ededed] focus:outline-none focus:border-[#8BAAA8] transition-colors`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-[#000000] border ${validationError.includes('password') ? 'border-red-500/50' : 'border-[#333333]'} rounded-md px-3 py-2 text-sm text-[#ededed] focus:outline-none focus:border-[#8BAAA8] transition-colors`}
            />
          </div>

          {(validationError || searchParams?.error) && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-xs text-red-400 text-center">{validationError || searchParams?.error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#4A696C]/20 border border-[#8BAAA8]/30 rounded-md">
              <p className="text-xs text-[#8BAAA8] text-center">{successMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#4A696C] text-white font-medium rounded-md px-4 py-2.5 text-sm transition-all shadow-lg shadow-[#4A696C]/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3A5658]'}`}
            >
              {isLoading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setValidationError('');
                setSuccessMessage('');
              }}
              className="text-xs text-[#a1a1aa] hover:text-white transition-colors py-2"
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
