"use client"

import { useSelectedDate } from '@/context/SelectedDateContext'
import { useEffect, useRef } from 'react'

export interface CalendarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Calendar({ isOpen = false, onClose }: CalendarProps) {
  const { selectedDate, setSelectedDate } = useSelectedDate()
  const calendarRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // Create array for blank spaces before first day
  const blanks = Array(firstDayOfMonth).fill(null)
  
  // Create array for days in month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  // Combine blanks and days
  const allDays = [...blanks, ...days]
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDate()
  const selectedDay = selectedDate.getDate()
  
  // Get month name
  const monthName = selectedDate.toLocaleString('default', { month: 'long' })

  const handleDateSelect = (day: number | null) => {
    if (day === null) return
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
    onClose?.()
  }

  return (
    <div ref={calendarRef} className="absolute z-50 left-0 right-0 mt-2 bg-[#FCFCFC] rounded-lg shadow-lg p-4 border-2 border-[#FCFBFB]">
      <div className="text-center mb-4">
        <h2 className="text-[#1E0C02] font-semibold">
          {monthName} {currentYear}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-[10px] font-semibold text-[#5F6666]"
          >
            {day}
          </div>
        ))}
        {allDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDateSelect(day)}
            className={`text-center p-2 rounded-full ${
              day === null 
                ? '' 
                : 'cursor-pointer text-sm ' + (
                    day === selectedDay
                      ? 'bg-[#F2600C] text-white font-semibold' 
                      : day === today 
                        ? 'bg-[#FEF7F3] text-[#1E0C02] font-semibold'
                        : 'hover:bg-[#FEF7F3] text-[#1E0C02]'
                  )
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
} 