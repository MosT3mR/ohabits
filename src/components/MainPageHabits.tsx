"use client"

import { Square, CheckSquare } from 'lucide-react'
import { useHabits } from '@/context/HabitsContext'

export default function MainPageHabits() {
  const { habits, setHabits } = useHabits([])
  const today = new Date().getDay()
  // Adjust Sunday from 0 to 6 to match our array index
  const dayIndex = today === 0 ? 6 : today - 1

  const toggleCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        return { ...habit, completed: !habit.completed }
      }
      return habit
    }))
  }

  // Filter habits scheduled for today
  const todaysHabits = habits.filter(habit => habit.scheduledDays[dayIndex])

  return (
    <div>
      <h2 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02] mb-4">
        Habits
      </h2>
      <div className="space-y-2">
        {todaysHabits.length === 0 ? (
          <p className="text-center text-[14px] text-[#5f6666]">No habits today !</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {todaysHabits.map(habit => (
              <div key={habit.id} className="flex items-center space-x-2">
                <button 
                  onClick={() => toggleCompletion(habit.id)}
                  className="text-[#2A3433] hover:opacity-75"
                >
                  {habit.completed ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                </button>
                <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-[#5f6666]">{habit.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 