"use client"

import React from 'react'
import Link from 'next/link'
import { Home, LayoutGrid, Hash, Dumbbell, User, Settings } from 'lucide-react'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 top-[52px] bg-white z-50">
      <div className="p-4 space-y-6">
        <nav className="space-y-6">
          <Link href="/" className="flex items-center space-x-4">
            <Home size={32} />
            <span className="text-2xl">Home</span>
          </Link>
          
          <Link href="/view" className="flex items-center space-x-4">
            <LayoutGrid size={32} />
            <span className="text-2xl">View mode</span>
          </Link>
          
          <Link href="/habits" className="flex items-center space-x-4">
            <Hash size={32} />
            <span className="text-2xl">Habits</span>
          </Link>
          
          <Link href="/workout" className="flex items-center space-x-4">
            <Dumbbell size={32} />
            <span className="text-2xl">Workout plans</span>
          </Link>
          
          <Link href="/profile" className="flex items-center space-x-4">
            <User size={32} />
            <span className="text-2xl">Profile page</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-4">
            <Settings size={32} />
            <span className="text-2xl">Settings</span>
          </Link>
        </nav>

        <button className="w-[310px] h-[80px] bg-[#F26008] rounded-[25px] text-white text-2xl mx-auto block mt-20">
          sign out
        </button>
      </div>
    </div>
  )
} 