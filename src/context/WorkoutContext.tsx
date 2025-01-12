"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/context/AuthContext'

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

interface WorkoutLog {
  workout_id: string
  completed_exercises: Exercise[]
  cardio: Array<{ name: string, minutes: number }>
  weight: string
  date: string
  notes?: string
}

interface WorkoutContextType {
  workouts: Workout[]
  logWorkout: (log: WorkoutLog) => Promise<void>
  getWorkoutForDate: (date: string) => Promise<WorkoutLog | null>
  updateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>
  deleteWorkout: (id: string) => Promise<void>
  saveWorkout: (workout: Omit<Workout, 'id'>) => Promise<Workout | null>
}

const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  logWorkout: async () => {},
  getWorkoutForDate: async () => null,
  updateWorkout: async () => {},
  deleteWorkout: async () => {},
  saveWorkout: async () => null,
})

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  const fetchWorkouts = useCallback(async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user?.id)

    if (error) {
      console.error('Error fetching workouts:', error)
      return
    }

    setWorkouts(data || [])
  }, [supabase, user?.id])

  useEffect(() => {
    if (user) {
      fetchWorkouts()
    }
  }, [user, fetchWorkouts])

  const logWorkout = async (log: WorkoutLog) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('workout_logs')
        .upsert(
          {
            user_id: user.id,
            workout_id: log.workout_id,
            completed_exercises: log.completed_exercises,
            cardio: log.cardio,
            weight: log.weight,
            date: log.date,
            notes: log.notes,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,date',
            ignoreDuplicates: false
          }
        )

      if (error) {
        console.error('Error logging workout:', error)
        throw error
      }
    } catch (error) {
      console.error('Error logging workout:', error)
      throw error
    }
  }

  const getWorkoutForDate = async (date: string) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // no rows found
        return null
      }
      console.error('Error fetching workout for date:', error)
      throw error
    }

    return data
  }

  const updateWorkout = async (id: string, workout: Partial<Workout>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('workouts')
        .update(workout)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating workout:', error)
        throw error
      }

      // Update local state
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(w => 
          w.id === id ? { ...w, ...workout } : w
        )
      )
    } catch (error) {
      console.error('Error updating workout:', error)
      throw error
    }
  }

  const deleteWorkout = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting workout:', error)
        throw error
      }

      // Update local state
      setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw error
    }
  }

  const saveWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          ...workout,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving workout:', error)
        throw error
      }

      // Update local state
      setWorkouts(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error saving workout:', error)
      throw error
    }
  }

  return (
    <WorkoutContext.Provider value={{ 
      workouts, 
      logWorkout, 
      getWorkoutForDate,
      updateWorkout,
      deleteWorkout,
      saveWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export const useWorkout = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider')
  }
  return context
} 