"use client"

export interface CalendarProps {
  isOpen?: boolean
}

export default function Calendar({ isOpen = false }: CalendarProps) {
  if (!isOpen) return null

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate()

  const weekDays = ['S', 'S', 'M', 'T', 'W', 'T', 'F']
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className="text-center p-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
} 