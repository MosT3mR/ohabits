"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient
  user: User | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient())
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          return
        }
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error in getUser:', error)
      }
    }

    // Get initial user
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (event === 'SIGNED_OUT') {
        // Clear any application state
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        router.push('/')
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 