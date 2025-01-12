"use client"

import { createContext, useContext, useState } from 'react'

interface SelectedDateContextType {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  formattedDate: string
}

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(undefined)

export function SelectedDateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Format date in YYYY-MM-DD format, adjusting for timezone offset
  const formattedDate = new Date(
    selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)
  ).toISOString().split('T')[0]

  return (
    <SelectedDateContext.Provider value={{ 
      selectedDate, 
      setSelectedDate,
      formattedDate
    }}>
      {children}
    </SelectedDateContext.Provider>
  )
}

export function useSelectedDate() {
  const context = useContext(SelectedDateContext)
  if (context === undefined) {
    throw new Error('useSelectedDate must be used within a SelectedDateProvider')
  }
  return context
} 