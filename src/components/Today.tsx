"use client"
import Image from 'next/image'
import Calendar from './Calendar'
import { useState } from 'react'
import { useSelectedDate } from '@/context/SelectedDateContext'

export default function Today() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { selectedDate, setSelectedDate } = useSelectedDate()

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }

  return (
    <div className="mb-4 relative">
      <div className="h-[90px] bg-[#FCFCFC] border-2 border-[#FCFBFB] rounded-lg flex p-[10px] justify-center">
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPreviousDay}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#EAEBEB] rounded-full transition-colors"
          >
            <Image src="/svg/left.svg" alt="Previous day" width={32} height={32} />
          </button>
          
          <div className="flex flex-col cursor-pointer" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
            <h2 className="text-[#1E0C02] text-[34px] font-bold leading-[40px]">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </h2>
            <span className="text-[#1E0C02] text-lg leading-[28px]">
              {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} / {selectedDate.getFullYear()}
            </span>
          </div>
          
          <button 
            onClick={goToNextDay}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#EAEBEB] rounded-full transition-colors"
          >
            <Image src="/svg/right.svg" alt="Next day" width={32} height={32} />
          </button>
        </div>
      </div>
      <Calendar 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        onDateSelect={(date) => {
          setSelectedDate(date)
          setIsCalendarOpen(false)
        }}
      />
    </div>
  )
} 