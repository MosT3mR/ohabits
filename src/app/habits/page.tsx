"use client"

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useHabits } from '@/context/HabitsContext'

const weekDays = ['S', 'S', 'M', 'T', 'W', 'T', 'F']

export default function HabitsPage() {
  const { habits, setHabits } = useHabits()
  const [newHabit, setNewHabit] = useState('')

  const toggleScheduledDay = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newScheduledDays = [...habit.scheduledDays]
        newScheduledDays[dayIndex] = !newScheduledDays[dayIndex]
        return { ...habit, scheduledDays: newScheduledDays }
      }
      return habit
    }))
  }

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        { 
          id: Date.now().toString(), 
          text: newHabit, 
          scheduledDays: Array(7).fill(false),
          completed: false
        }
      ])
      setNewHabit('')
    }
  }

  const removeHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId))
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="p-4 bg-white rounded-lg">
          <h1 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02] mb-4">Habits</h1>
          
          <div className="bg-[#FFEAD9] rounded-lg p-2 mb-4">
            <div className="flex mb-2">
              <div className="w-24 font-semibold text-[14px] leading-[121%] text-[#1e0c02]">Habit name</div>
              <div className="flex-1 grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center text-[12px] font-semibold leading-[117%] tracking-[0.08em] uppercase text-black">{day}</div>
                ))}
              </div>
              <div className="w-8"></div>
            </div>
          </div>

          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center">
                <div className="w-24 text-[12px] font-semibold leading-[117%] text-black">{habit.text}</div>
                <div className="flex-1 grid grid-cols-7 gap-2">
                  {habit.scheduledDays.map((isScheduled, index) => (
                    <button
                      key={index}
                      onClick={() => toggleScheduledDay(habit.id, index)}
                      className={`w-6 h-6 border-2 rounded ${
                        isScheduled ? 'bg-black border-black' : 'border-[#2A3433]'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => removeHabit(habit.id)}
                  className="w-8 flex items-center justify-center"
                >
                  <X className="text-[#000]" size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="New Habit..."
              className="flex-1 px-2 py-1 text-sm bg-[#EAEBEB] placeholder:text-[#5F6666] text-[#000] rounded"
            />
            <button
              onClick={addHabit}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Plus className="text-[#000]" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 