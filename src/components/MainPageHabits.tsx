"use client"

import { useHabits } from '@/context/HabitsContext'
import { useSelectedDate } from '@/context/SelectedDateContext'
import Link from 'next/link'

export default function MainPageHabits() {
  const { habits, toggleHabit } = useHabits()
  const { selectedDate, formattedDate } = useSelectedDate()
  const dayIndex = selectedDate.getDay()
  const today = new Date()
  const isToday = formattedDate === new Date(
    today.getTime() - (today.getTimezoneOffset() * 60000)
  ).toISOString().split('T')[0]

  const relevantHabits = habits.filter(habit => 
    habit.scheduledDays[dayIndex] || habit.completed
  )

  return (
    <div className="space-y-4 pb-7 border-b border-[#EAEBEB]">
      <h3 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">
        {isToday ? "Habits" : `Habits for ${selectedDate.toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'}).split('/').join(' / ')}`}
      </h3>
      {relevantHabits.length > 0 ? (
        <div className="space-y-2">
          {relevantHabits.map(habit => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`w-full p-3 rounded flex items-center justify-between ${
                habit.completed 
                  ? 'bg-[#F2600C] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-white' 
                  : 'bg-[#FEF7F3] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-[#5F6666]'
              }`}
            >
              <span className="flex items-center gap-2">
                {habit.name}
                {!habit.scheduledDays[dayIndex] && habit.completed && 
                  <span className="text-[8px]">(unscheduled)</span>
                }
              </span>
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