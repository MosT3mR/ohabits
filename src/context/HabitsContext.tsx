"use client"

import React, { createContext, useContext, useState } from 'react'

interface Habit {
  id: string
  text: string
  scheduledDays: boolean[]
  completed: boolean
}

interface HabitsContextType {
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  return (
    <HabitsContext.Provider value={{ habits, setHabits }}>
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitsContext)
  if (!context) throw new Error('useHabits must be used within a HabitsProvider')
  return context
} 