"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { AuthError } from '@supabase/supabase-js'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Show success message and redirect
      alert('Check your email to confirm your account!')
      router.push('/login')
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <form onSubmit={handleSignUp} className="p-4 bg-white rounded-lg space-y-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02]">Sign Up</h1>
            <Image src="/svg/login.svg" alt="Logo" width={24} height={24} />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="relative">
                <Image 
                  src="/svg/email.svg" 
                  alt="Email" 
                  width={16} 
                  height={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] placeholder:text-[#5F6666] text-[#1e0c02]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Image 
                  src="/svg/password.svg" 
                  alt="Password" 
                  width={16} 
                  height={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] placeholder:text-[#5F6666] text-[#1e0c02]"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#F2600C] text-[#fcfcfc] py-3 rounded font-semibold text-[18px] leading-[120%] disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e0c02]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#1e0c02]">or continue with</span>
            </div>
          </div>

          {/* <div className="space-y-1">
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-[#EAEBEB] rounded"
            >
              <Image src="/svg/google.svg" alt="Google" width={20} height={20} className="text-[#181919]" />
              <span className="font-semibold text-[18px] leading-[120%] text-center text-[#181919]">Sign Up with Google</span>
            </button>
          </div> */}

          <div className="text-center">
            <Link 
              href="/login" 
              className="w-full py-3 border border-[#EAEBEB] rounded block"
            >
              <span className="font-semibold text-[18px] leading-[120%] text-[#181919]">Already have an account? Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 