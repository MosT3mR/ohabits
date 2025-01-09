"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface Habit {
  id: string
  text: string
  scheduledDays: boolean[]  // Which days the habit should appear
  completed: boolean        // Whether it's completed for today
}

interface HabitsContextType {
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', text: 'Reading', scheduledDays: Array(7).fill(false), completed: false },
    { id: '2', text: 'Learn Dutch', scheduledDays: Array(7).fill(false), completed: false },
    { id: '3', text: 'Fast typing', scheduledDays: Array(7).fill(false), completed: false },
    { id: '4', text: 'Work on startup', scheduledDays: Array(7).fill(false), completed: false },
    { id: '5', text: 'Learn Rust', scheduledDays: Array(7).fill(false), completed: false },
  ])

  return (
    <HabitsContext.Provider value={{ habits, setHabits }}>
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitsContext)
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider')
  }
  return context
} 