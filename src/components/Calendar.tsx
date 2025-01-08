"use client"
import { useState } from 'react'
import Image from 'next/image'
interface CalendarProps {
  isOpen: boolean
}

export default function Calendar({ isOpen }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState('September')
  const [currentYear, setCurrentYear] = useState('2022')
  
  if (!isOpen) return null

  const weekDays = ['S', 'S', 'M', 'T', 'W', 'T', 'F']
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  
  return (
    <div className="h-[220px] bg-[#FCFCFC] border-2 border-[#FCFBFB] rounded-lg p-[10px] mt-2">
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-[10px]">
        <div className="w-8 h-8 cursor-pointer">
          <Image src="/svg/c-left.svg" alt="left" width={32} height={32} />
        </div>
        
        <div className="flex gap-2 text-[#1E0C02]">
          <span className="text-[23px] font-bold leading-[122%] tracking-[-0.02em] text-[#1e0c02]">{currentMonth}</span>
          <span className="text-[23px] font-bold leading-[122%] tracking-[-0.02em] text-[#1e0c02]">{currentYear}</span>
        </div>
        
        <div className="w-8 h-8 cursor-pointer">
          <Image src="/svg/c-right.svg" alt="right" width={32} height={32} />
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="h-7 flex items-center justify-center">
            <span className="text-xs font-semibold leading-[117%] tracking-[0.08em] uppercase text-black">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day) => (
          <div 
            key={day}
            className={`h-7 flex items-center justify-center ${
              day === 24 ? 'bg-[#FBD0B6] rounded-full' : ''
            }`}
          >
            <span className="text-lg font-semibold leading-[120%] text-black">{day}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 