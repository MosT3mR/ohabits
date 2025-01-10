"use client"

import React, { createContext, useContext, useState } from 'react'

interface Exercise {
  id: string
  name: string
  sets: Array<{
    reps: number
    weight: number
  }>
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
  selectedDay: string
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedDay, setSelectedDay] = useState('Saturday')

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts, selectedDay, setSelectedDay }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider')
  return context
} 