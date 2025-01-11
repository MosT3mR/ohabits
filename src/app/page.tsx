import MoodRating from '@/components/MoodRating'
import TodoSection from '@/components/TodoSection'
import MainPageHabits from '@/components/MainPageHabits'
import Workout from '@/components/Workout'
import Today from '@/components/Today'

export default function Home() {
  const todaysWorkout = {
    name: "Today's Workout",
    exercises: [],  // Empty array for now
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto space-y-4">
        <Today />
        <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4">
          <MainPageHabits />
          <TodoSection />
          <MoodRating />
        </div>
        <Workout 
          name={todaysWorkout.name}
          exercises={todaysWorkout.exercises}
          day={todaysWorkout.day}
        />
      </div>
    </div>
  )
}
