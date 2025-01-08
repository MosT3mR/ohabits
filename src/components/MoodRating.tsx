"use client"

import { useState } from 'react'

export default function MoodRating() {
  const [rating, setRating] = useState<number | null>(null)
  const numbers = Array.from({length: 10}, (_, i) => i + 1)

  return (
    <div className="mt-8">
      <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">How is the day</h2>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-5 items-center justify-center">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={`w-4 h-4 rounded-full border-2 ${
                rating === num 
                  ? 'bg-[#5F6666] border-[#2A3433]' 
                  : 'border-[#5F6666]'
              }`}
            >
              <span className="sr-only">{num}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-5 justify-center">
          {numbers.map((num) => (
            <span key={num} className="text-[#5F6666] text-sm w-4 text-center">
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}