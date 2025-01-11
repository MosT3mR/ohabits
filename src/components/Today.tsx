"use client"
import Image from 'next/image'
import Calendar from './Calendar'
import { useState } from 'react'

export default function Today() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  return (
    <div className="mb-4 relative">
      <div className="h-[90px] bg-[#FCFCFC] border-2 border-[#FCFBFB] rounded-lg flex p-[10px]">
        <div className="flex-grow flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/svg/left.svg" alt="left" width={32} height={32} />
            </div>
            
            <div className="flex flex-col cursor-pointer" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
              <h2 className="text-[#1E0C02] text-[34px] font-bold leading-[40px]">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h2>
              <span className="text-[#1E0C02] text-lg leading-[28px]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} / {new Date().getFullYear()}</span>
            </div>
          </div>
          
          <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/svg/right.svg" alt="right" width={32} height={32} />
          </div>
        </div>
        
        <div className="w-[70px] h-[70px] rounded-full border-[3px] border-[#F26008] p-[5px]">
          <div className="w-full h-full rounded-full border-[3px] border-[#FBD0B6] flex items-center justify-center">
            <span className="text-[#1E0C02] text-lg font-bold">100%</span>
          </div>
        </div>
      </div>
      <Calendar isOpen={isCalendarOpen} />
    </div>
  )
} 