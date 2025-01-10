"use client"

import { createContext, useContext, useState } from 'react'

interface Habit {
  id: string
  name: string
  completed: boolean
  scheduledDays: boolean[]
}

interface HabitsContextType {
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  addHabit: (name: string) => void
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([
    { 
      id: '1', 
      name: 'Morning Workout', 
      completed: false,
      scheduledDays: [true, true, true, true, true, false, false]
    },
    { 
      id: '2', 
      name: 'Read 30 mins', 
      completed: false,
      scheduledDays: [true, true, true, true, true, true, true]
    },
    { 
      id: '3', 
      name: 'Meditate', 
      completed: false,
      scheduledDays: [true, true, true, true, true, true, true]
    },
  ])

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name,
      scheduledDays: Array(7).fill(false),
      completed: false
    }
    setHabits(prev => [...prev, newHabit])
  }

  return (
    <HabitsContext.Provider value={{ habits, setHabits, addHabit }}>
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