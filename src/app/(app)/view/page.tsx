"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWorkout } from '@/context/WorkoutContext'
import { useHabits } from '@/context/HabitsContext'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useAuth } from '@/context/AuthContext'

interface CardioExercise {
  name: string
  minutes: number
}

interface HabitCompletion {
  habit_id: string
  completed: boolean
  date: string
}

interface HabitWithCreation {
  id: string
  name: string
  scheduled_days: boolean[]
  created_at: string
}

type WorkoutLog = {
  workout_id: string
  cardio?: CardioExercise[]
  weight?: number
  date: string
}

export default function ViewPage() {
  const { workouts, getWorkoutForDate } = useWorkout()
  useHabits()
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, WorkoutLog>>({})
  const [habitCompletions, setHabitCompletions] = useState<{ [key: string]: HabitCompletion[] }>({})
  const [habitsWithCreation, setHabitsWithCreation] = useState<HabitWithCreation[]>([])
  const [moodRatings, setMoodRatings] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Get array of years from 2020 to current year
  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
    setShowDatePicker(false)
  }

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
    setShowDatePicker(false)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), monthIndex, 1))
    setShowDatePicker(false)
  }

  const handleYearSelect = (year: number) => {
    setSelectedDate(new Date(year, selectedDate.getMonth(), 1))
    setShowDatePicker(false)
  }

  // Get days in the selected month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1)
      // Adjust for timezone to ensure consistent dates
      date.setHours(12, 0, 0, 0)
      return date
    })
  }

  const formatDateForDB = (date: Date) => {
    // Adjust the date to local timezone and format for DB
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return localDate.toISOString().split('T')[0]
  }

  // Fetch workout logs for the current month
  useEffect(() => {
    const fetchMonthLogs = async () => {
      setIsLoading(true)
      const daysInMonth = getDaysInMonth(selectedDate)
      const logs: Record<string, WorkoutLog> = {}

      for (const date of daysInMonth) {
        const formattedDate = formatDateForDB(date)
        const log = await getWorkoutForDate(formattedDate)
        if (log) {
          logs[formattedDate] = {
            workout_id: log.workout_id,
            cardio: log.cardio,
            weight: typeof log.weight === 'string' ? parseFloat(log.weight) : log.weight,
            date: log.date
          }
        }
      }

      setWorkoutLogs(logs)
      setIsLoading(false)
    }

    fetchMonthLogs()
  }, [selectedDate, getWorkoutForDate])

  // Fetch habit completions for the current month
  useEffect(() => {
    const fetchHabitCompletions = async () => {
      if (!user) return

      const daysInMonth = getDaysInMonth(selectedDate)
      const startDate = formatDateForDB(daysInMonth[0])
      const endDate = formatDateForDB(daysInMonth[daysInMonth.length - 1])

      try {
        const { data, error } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        if (error) throw error

        const completions: { [key: string]: HabitCompletion[] } = {}
        data?.forEach(completion => {
          if (!completions[completion.date]) {
            completions[completion.date] = []
          }
          completions[completion.date].push(completion)
        })

        setHabitCompletions(completions)
      } catch (error) {
        console.error('Error fetching habit completions:', error)
      }
    }

    fetchHabitCompletions()
  }, [selectedDate, supabase, user])

  // Fetch habits with creation dates
  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('habits')
          .select('id, name, scheduled_days, created_at')
          .eq('user_id', user.id)

        if (error) throw error
        setHabitsWithCreation(data || [])
      } catch (error) {
        console.error('Error fetching habits:', error)
      }
    }

    fetchHabits()
  }, [supabase, user])

  // Fetch mood ratings for the current month
  useEffect(() => {
    const fetchMoodRatings = async () => {
      if (!user) return

      const daysInMonth = getDaysInMonth(selectedDate)
      const startDate = formatDateForDB(daysInMonth[0])
      const endDate = formatDateForDB(daysInMonth[daysInMonth.length - 1])

      try {
        const { data, error } = await supabase
          .from('mood_ratings')
          .select('date, rating')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)

        if (error) {
          console.error('Supabase error:', error)
          return
        }

        if (!data || data.length === 0) return

        const ratings: Record<string, number> = {}
        data.forEach((mood: { date: string, rating: string | number }) => {
          if (mood && mood.date) {
            ratings[mood.date] = typeof mood.rating === 'string' ? parseInt(mood.rating) : mood.rating
          }
        })

        setMoodRatings(ratings)
      } catch (error) {
        console.error('Error in fetchMoodRatings:', error)
      }
    }

    fetchMoodRatings()
  }, [selectedDate, supabase, user])

  const isFutureDate = (date: Date) => {
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    return date > today
  }

  const getWorkoutLogForDate = (date: Date) => {
    const formattedDate = formatDateForDB(date)
    return workoutLogs[formattedDate]
  }

  const getWorkoutName = (date: Date) => {
    if (isFutureDate(date)) return '-'
    
    const log = getWorkoutLogForDate(date)
    if (!log) return '❌'
    
    const workout = workouts.find(w => w.id === log.workout_id)
    return workout?.name || '❌'
  }

  const getCardioInfo = (date: Date) => {
    if (isFutureDate(date)) return '-'
    
    const log = getWorkoutLogForDate(date)
    if (!log || !log.cardio || log.cardio.length === 0) return '❌'
    
    return log.cardio.map((c: CardioExercise) => `${c.name} (${c.minutes}min)`).join(', ')
  }

  const getWeightInfo = (date: Date) => {
    if (isFutureDate(date)) return '-'
    
    const log = getWorkoutLogForDate(date)
    if (!log || !log.weight) return '❌'
    return log.weight
  }

  const getHabitsForDate = (date: Date) => {
    if (isFutureDate(date)) return '-'
    
    const formattedDate = formatDateForDB(date)
    const dayOfWeek = date.getDay()

    // Get habits that existed on this date (based on creation date)
    const existingHabits = habitsWithCreation.filter(habit => {
      const creationDate = new Date(habit.created_at)
      return creationDate <= date && habit.scheduled_days[dayOfWeek]
    })

    // Get completions for this date
    const completionsForDate = habitCompletions[formattedDate] || []
    
    // If no habits existed on this date and no completions recorded
    if (existingHabits.length === 0 && completionsForDate.length === 0) return '-'

    // Count completed habits from completions
    const completedCount = completionsForDate.filter(c => c.completed).length

    // Use the larger number between scheduled habits and completions as total
    const totalCount = Math.max(existingHabits.length, completionsForDate.length)

    return `${completedCount}/${totalCount}`
  }

  const getMoodRating = (date: Date) => {
    if (isFutureDate(date)) return '-'
    
    const formattedDate = formatDateForDB(date)
    const rating = moodRatings[formattedDate]
    
    if (rating === undefined || rating === null) return '❌'
    return rating.toString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F2600C] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#1E0C02] font-semibold">Loading data...</p>
        </div>
      </div>
    )
  }

  const daysInMonth = getDaysInMonth(selectedDate)

  return (
    <div className="p-4">
      {/* Month Selection */}
      <div className="flex items-center justify-between mb-6 bg-[#FCFCFC] border-2 border-[#FCFBFB] rounded-lg p-4">
        <button 
          onClick={goToPreviousMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#EAEBEB] rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#1E0C02]" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-[#1E0C02] text-2xl font-bold hover:text-[#F2600C] transition-colors"
          >
            {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </button>

          {showDatePicker && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 p-6 bg-white rounded-lg shadow-lg border border-[#EAEBEB] z-10 w-[340px]">
              <div className="mb-6">
                <h3 className="text-[#5F6666] font-semibold mb-3 text-sm">Month</h3>
                <div className="grid grid-cols-3 gap-3">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`py-3 px-2 rounded-lg text-base font-medium transition-colors ${
                        index === selectedDate.getMonth()
                          ? 'bg-[#F2600C] text-white'
                          : 'hover:bg-[#FEF7F3] text-[#1E0C02] hover:text-[#F2600C]'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[#5F6666] font-semibold mb-3 text-sm">Year</h3>
                <div className="grid grid-cols-4 gap-3">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`py-3 px-2 rounded-lg text-base font-medium transition-colors ${
                        year === selectedDate.getFullYear()
                          ? 'bg-[#F2600C] text-white'
                          : 'hover:bg-[#FEF7F3] text-[#1E0C02] hover:text-[#F2600C]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#EAEBEB] rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#1E0C02]" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#FCFCFC] border-2 border-[#FCFBFB] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#FCFBFB]">
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Day</th>
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Workout</th>
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Cardio</th>
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Weight</th>
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Habits</th>
              <th className="py-3 px-4 text-left text-[#5F6666] font-semibold">Mood</th>
            </tr>
          </thead>
          <tbody>
            {daysInMonth.map((date: Date) => (
              <tr 
                key={date.toISOString()} 
                className={`border-b border-[#FCFBFB] ${
                  date.toDateString() === new Date().toDateString() ? 'bg-[#FEF7F3]' : ''
                }`}
              >
                <td className="py-3 px-4 text-[#1E0C02] font-semibold">
                  {date.getDate()}
                </td>
                <td className="py-3 px-4 text-[#1E0C02]">
                  {getWorkoutName(date)}
                </td>
                <td className="py-3 px-4 text-[#1E0C02]">
                  {getCardioInfo(date)}
                </td>
                <td className="py-3 px-4 text-[#1E0C02]">
                  {getWeightInfo(date)}
                </td>
                <td className="py-3 px-4 text-[#1E0C02]">
                  {getHabitsForDate(date)}
                </td>
                <td className="py-3 px-4 text-[#1E0C02]">
                  {getMoodRating(date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}