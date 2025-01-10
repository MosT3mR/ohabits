"use client"

import { useHabits } from '@/context/HabitsContext'

export default function HabitsOverview() {
  const { habits } = useHabits()
  
  const completedHabits = habits.filter(habit => habit.completed).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0

  return (
    <section className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Habits Overview</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Completion Rate</p>
          <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Habits</p>
          <p className="text-xl">{totalHabits}</p>
        </div>
      </div>
    </section>
  )
} 