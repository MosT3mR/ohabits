"use client"

import { useHabits } from '@/context/HabitsContext'
import { useSelectedDate } from '@/context/SelectedDateContext'
import Link from 'next/link'

export default function MainPageHabits() {
  const { habits, toggleHabit } = useHabits()
  const { selectedDate, formattedDate } = useSelectedDate()
  const dayIndex = selectedDate.getDay()
  const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1
  const today = new Date()
  const isToday = formattedDate === new Date(
    today.getTime() - (today.getTimezoneOffset() * 60000)
  ).toISOString().split('T')[0]

  const scheduledHabits = habits.filter(habit => habit.scheduledDays[adjustedDayIndex])

  return (
    <div className="space-y-4 pb-7 border-b border-[#EAEBEB]">
      <h3 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">
        {isToday ? "Habits" : `Habits for ${selectedDate.toLocaleDateString()}`}
      </h3>
      {scheduledHabits.length > 0 ? (
        <div className="space-y-2">
          {scheduledHabits.map(habit => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full p-3 rounded flex items-center justify-between ${
                habit.completed 
                  ? 'bg-[#F2600C] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-white' 
                  : 'bg-[#FEF7F3] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-[#5F6666]'
              }`}
            >
              <span>{habit.name}</span>
              {habit.completed && <span>✓</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>No habits scheduled for this day.</p>
          <Link href="/habits" className="text-[#F2600C] hover:underline mt-2 inline-block">
            Add habits from the menu
          </Link>
        </div>
      )}
    </div>
  )
} 