"use client"

import { useState } from 'react'
import { useHabits } from '@/context/HabitsContext'

export default function HabitsPage() {
  const { habits, setHabits } = useHabits()
  const [newHabit, setNewHabit] = useState('')

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    setHabits([
      ...habits,
      { 
        id: Date.now().toString(), 
        name: newHabit,
        scheduledDays: Array(7).fill(false),
        completed: false
      }
    ])
    setNewHabit('')
  }

  const toggleDay = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newScheduledDays = [...habit.scheduledDays]
        newScheduledDays[dayIndex] = !newScheduledDays[dayIndex]
        return { ...habit, scheduledDays: newScheduledDays }
      }
      return habit
    }))
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Habits</h1>
      
      <form onSubmit={handleAddHabit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter new habit"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#F2600C] text-white rounded"
          >
            Add Habit
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {habits.map(habit => (
          <div key={habit.id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">{habit.name}</h3>
            <div className="flex gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(habit.id, index)}
                  className={`w-8 h-8 rounded-full ${
                    habit.scheduledDays[index]
                      ? 'bg-[#F2600C] text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 