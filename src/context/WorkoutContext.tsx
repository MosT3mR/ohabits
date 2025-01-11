"use client"

import { createContext, useContext, useState } from 'react'

interface Set {
  reps: number
}

interface Exercise {
  id: string
  name: string
  sets: Set[]
}

interface Workout {
  id: string
  name: string
  day: string
  exercises: Exercise[]
}

interface WorkoutContextType {
  workouts: Workout[]
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
} 