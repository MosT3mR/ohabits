"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Menu from '../Menu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-[#FAB791] h-[52px] px-4 flex justify-between items-center border-b-2 border-[#dee2e6] rounded-b-[10px] fixed top-0 left-0 right-0 z-[51]">
        {!isMenuOpen ? (
          <>
            <button 
              className="menu-btn w-6 h-6 flex flex-col justify-around p-[3px]"
              onClick={() => {
                console.log('Menu button clicked, current state:', isMenuOpen)
                setIsMenuOpen(true)
              }}
            >
              <span className="w-[18px] h-[2px] bg-[#F4F5F7]" />
              <span className="w-[18px] h-[2px] bg-[#F4F5F7]" />
              <span className="w-[18px] h-[2px] bg-[#F4F5F7]" />
            </button>
            <h1 className="text-[#F4F5F7] font-bold text-[34px] leading-[118%] tracking-[-0.04em]">
              Ohabits
            </h1>
            <div className="profile flex items-center p-0.5 rounded-lg border border-[#F6F7F7] w-[110px] h-[45px]">
              <Image src="/images/profile.jpg" alt="Avatar" width={36} height={36} className="rounded-full" />
              <span className="text-[#f6f7f7] font-semibold text-[10px] leading-[120%] tracking-[0.02em] ml-2">
                Othman Alomair
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[#F4F5F7] font-bold text-[34px] leading-[118%] tracking-[-0.04em]">
              Ohabits
            </h1>
            <button onClick={() => setIsMenuOpen(false)}>
              <Image src="/svg/x.svg" alt="Close" width={24} height={24} />
            </button>
          </>
        )}
      </header>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="h-[52px]"></div> {/* Spacer to prevent content from going under fixed header */}
    </>
  )
} 