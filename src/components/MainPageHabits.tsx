"use client"

import { useHabits } from '@/context/HabitsContext'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function MainPageHabits() {
  const { habits, setHabits, addHabit } = useHabits()
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')

  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ))
  }

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim())
      setNewHabitName('')
      setShowAddHabit(false)
    }
  }

  const todaysHabits = habits.filter(habit => habit.scheduledDays[dayIndex])

  return (
    <div className="space-y-4 pb-7 border-b border-[#EAEBEB]">
      <h3 className="text-[#1E0C02] text-xl">Habits</h3>
      <div className="space-y-2">
        {todaysHabits.map(habit => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full p-3 rounded flex items-center justify-between ${
              habit.completed ? 'bg-[#F2600C] text-white' : 'bg-[#FEF7F3]'
            }`}
          >
            <span>{habit.name}</span>
            {habit.completed && <span>✓</span>}
          </button>
        ))}
      </div>
      
      {showAddHabit ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter new habit"
            className="w-full p-2 border rounded"
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddHabit}
              className="px-4 py-2 bg-[#F2600C] text-white rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddHabit(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center gap-2 text-sm text-[#F2600C]"
        >
          <Plus size={16} />
          Add Habit
        </button>
      )}
    </div>
  )
} 