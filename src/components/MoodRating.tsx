"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'

interface MoodRating {
  id: string
  rating: number
  date: string
  user_id: string
}

export default function MoodRating() {
  const [rating, setRating] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { supabase, user } = useSupabase()
  const numbers = Array.from({length: 10}, (_, i) => i + 1)
  const today = new Date().toISOString().split('T')[0]

  // Fetch today's mood rating
  useEffect(() => {
    const fetchMoodRating = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('mood_ratings')
          .select('rating')
          .eq('user_id', user.id)
          .eq('date', today)
          .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"

        if (data) {
          setRating(data.rating)
        }
      } catch (error) {
        console.error('Error fetching mood rating:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodRating()
  }, [supabase, user, today])

  const handleRatingClick = async (num: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('mood_ratings')
        .upsert({
          rating: num,
          date: today,
          user_id: user.id
        })

      if (error) throw error

      setRating(num)
    } catch (error) {
      console.error('Error saving mood rating:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">How is the day</h2>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex gap-5 items-center justify-center">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleRatingClick(num)}
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