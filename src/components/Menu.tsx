"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Home, LayoutGrid, Hash, Dumbbell, User, Instagram, Twitter, Github } from 'lucide-react'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  if (!isOpen) return null

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        alert('Error signing out')
        return
      }
      
      // Close the menu and redirect to login page
      onClose()
      router.push('/login')
    } catch (error) {
      console.error('Error:', error)
      alert('Error signing out')
    }
  }

  return (
    <div className="fixed inset-0 top-[52px] bg-white z-[52]">
      <div className="p-4 space-y-6">
        <nav className="space-y-6 pl-[6px]">
          <Link href="/" onClick={onClose} className="flex items-center space-x-4">
            <Home size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">Home</span>
          </Link>
          
          <Link href="/view" onClick={onClose} className="flex items-center space-x-4">
            <LayoutGrid size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">View mode</span>
          </Link>
          
          <Link href="/habits" onClick={onClose} className="flex items-center space-x-4">
            <Hash size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">Habits</span>
          </Link>
          
          <Link href="/workout" onClick={onClose} className="flex items-center space-x-4">
            <Dumbbell size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">Workout plans</span>
          </Link>
          
          <Link href="/profile" onClick={onClose} className="flex items-center space-x-4">
            <User size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">Profile page</span>
          </Link>
          
          {/* <Link href="/settings" onClick={onClose} className="flex items-center space-x-4">
            <Settings size={32} className="text-black" />
            <span className="text-[34px] font-bold leading-[118%] tracking-[-0.04em] text-black">Settings</span>
          </Link> */}
        </nav>

        <div className="mt-6">
          <button 
            onClick={handleSignOut}
            className="w-[310px] h-[80px] bg-[#F26008] rounded-[25px] text-white text-2xl mx-auto block mt-20 hover:bg-[#E05A0C] transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Social Links and Credit */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="flex justify-center space-x-20 mb-4 pb-4">
            <Link 
              href="https://instagram.com/othman.alomair" 
              target="_blank"
              className="hover:opacity-75 transition-opacity"
            >
              <Instagram size={24} className="text-black" />
            </Link>
            
            <Link 
              href="https://twitter.com/most3mr" 
              target="_blank"
              className="hover:opacity-75 transition-opacity"
            >
              <Twitter size={24} className="text-black" />
            </Link>
            
            <Link 
              href="https://github.com/most3mr" 
              target="_blank"
              className="hover:opacity-75 transition-opacity"
            >
              <Github size={24} className="text-black" />
            </Link>
          </div>
          
          <p className="text-xs font-semibold text-center tracking-[0.08em] leading-[117%] uppercase text-black">
            DESIGNED BY OTHMAN ALOMAIR
          </p>
        </div>
      </div>
    </div>
  )
}