'use client'

import { login, signup } from './actions'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        
        <div className="flex flex-col gap-3 mb-6">
          <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md border border-[#333333] bg-[#1a1a1a] hover:bg-[#222222] text-[#ededed] text-sm font-medium transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            Continue with Google
          </button>
          
          <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md border border-[#333333] bg-[#1a1a1a] hover:bg-[#222222] text-[#ededed] text-sm font-medium transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            Continue with GitHub
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
              className="w-full bg-[#4A696C] text-white font-medium rounded-md px-4 py-2.5 text-sm hover:bg-[#3A5658] transition-colors shadow-lg shadow-[#4A696C]/20"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setValidationError(''); }}
              className="w-full bg-transparent text-[#a1a1aa] hover:text-[#ededed] border border-[#333333] hover:border-[#4A696C] font-medium rounded-md px-4 py-2.5 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
