"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useSelectedDate } from '@/context/SelectedDateContext'

interface Habit {
  id: string
  name: string
  completed: boolean
  scheduledDays: boolean[]
}

interface HabitsContextType {
  habits: Habit[]
  isLoading: boolean
  addHabit: (name: string) => Promise<void>
  toggleHabit: (habitId: string) => Promise<void>
  toggleHabitDay: (habitId: string, dayIndex: number) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  updateHabitName: (habitId: string, newName: string) => Promise<void>
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { supabase, user } = useSupabase()
  const { formattedDate } = useSelectedDate()

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      const habitsResponse = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)

      if (habitsResponse.error) {
        throw new Error(`Failed to fetch habits: ${habitsResponse.error.message}`)
      }

      const habitsData = habitsResponse.data || []

      const completionsResponse = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', formattedDate)

      if (completionsResponse.error) {
        throw new Error(`Failed to fetch completions: ${completionsResponse.error.message}`)
      }

      const completionsData = completionsResponse.data || []

      const combinedHabits = habitsData.map(habit => ({
        id: habit.id,
        name: habit.name,
        scheduledDays: habit.scheduled_days || Array(7).fill(false),
        completed: completionsData.some(
          completion => completion.habit_id === habit.id && completion.completed
        ) || false
      }))

      setHabits(combinedHabits)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in fetchHabits:', error.message)
      } else {
        console.error('Unknown error in fetchHabits:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [supabase, user, formattedDate])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const addHabit = async (name: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          name,
          user_id: user.id,
          scheduled_days: Array(7).fill(false)
        }])
        .select('id, name, scheduled_days')
        .single()

      if (error) {
        throw new Error(`Failed to add habit: ${error.message}`)
      }

      if (data) {
        setHabits(prev => [...prev, {
          id: data.id,
          name: data.name,
          scheduledDays: data.scheduled_days || Array(7).fill(false),
          completed: false
        }])
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding habit:', error.message)
      } else {
        console.error('Unknown error adding habit:', error)
      }
      throw error
    }
  }

  const toggleHabit = async (habitId: string) => {
    if (!user) return

    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      const newCompletionStatus = !habit.completed

      const { error } = await supabase
        .from('habit_completions')
        .upsert({
          habit_id: habitId,
          user_id: user.id,
          completed: newCompletionStatus,
          date: formattedDate
        }, {
          onConflict: 'user_id,habit_id,date'
        })

      if (error) {
        throw new Error(`Failed to toggle habit: ${error.message}`)
      }

      setHabits(prev => prev.map(h =>
        h.id === habitId ? { ...h, completed: newCompletionStatus } : h
      ))
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error toggling habit:', error.message)
      } else {
        console.error('Unknown error toggling habit:', error)
      }
    }
  }

  const toggleHabitDay = async (habitId: string, dayIndex: number) => {
    if (!user) return

    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      const newScheduledDays = [...habit.scheduledDays]
      newScheduledDays[dayIndex] = !newScheduledDays[dayIndex]

      const { error } = await supabase
        .from('habits')
        .update({ scheduled_days: newScheduledDays })
        .eq('id', habitId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to update habit days: ${error.message}`)
      }

      setHabits(prev => prev.map(h =>
        h.id === habitId ? { ...h, scheduledDays: newScheduledDays } : h
      ))
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating habit days:', error.message)
      } else {
        console.error('Unknown error updating habit days:', error)
      }
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to delete habit: ${error.message}`)
      }

      setHabits(prev => prev.filter(h => h.id !== habitId))
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting habit:', error.message)
      } else {
        console.error('Unknown error deleting habit:', error)
      }
    }
  }

  const updateHabitName = async (habitId: string, newName: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('habits')
        .update({ name: newName })
        .eq('id', habitId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to update habit name: ${error.message}`)
      }

      setHabits(prev => prev.map(h =>
        h.id === habitId ? { ...h, name: newName } : h
      ))
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating habit name:', error.message)
      } else {
        console.error('Unknown error updating habit name:', error)
      }
    }
  }

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      isLoading, 
      addHabit, 
      toggleHabit, 
      toggleHabitDay,
      deleteHabit,
      updateHabitName,
      setHabits
    }}>
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