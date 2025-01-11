"use client"

export interface CalendarProps {
  isOpen?: boolean
}

export default function Calendar({ isOpen = false }: CalendarProps) {
  if (!isOpen) return null

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // Create array for blank spaces before first day
  const blanks = Array(firstDayOfMonth).fill(null)
  
  // Create array for days in month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  // Combine blanks and days
  const allDays = [...blanks, ...days]
  
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = currentDate.getDate()
  
  // Get month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  return (
    <div className="absolute z-50 left-0 right-0 mt-2 bg-[#FCFCFC] rounded-lg shadow-lg p-4 border-2 border-[#FCFBFB]">
      <div className="text-center mb-4">
        <h2 className="text-[#1E0C02] font-semibold">
          {monthName} {currentYear}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-[10px] font-semibold text-[#5F6666]"
          >
            {day}
          </div>
        ))}
        {allDays.map((day, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-full ${
              day === null 
                ? '' 
                : 'cursor-pointer text-sm ' + (
                    day === today 
                      ? 'bg-[#F2600C] text-white font-semibold' 
                      : 'hover:bg-[#FEF7F3] text-[#1E0C02]'
                  )
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
} 