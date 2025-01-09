import Today from "@/components/Today"
import TodoSection from "@/components/TodoSection"
import MoodRating from "@/components/MoodRating"
import Workout from "@/components/Workout"
import MainPageHabits from '@/components/MainPageHabits'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto space-y-4">
        <Today />
        <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4">
          <MainPageHabits />
          <TodoSection />
          <MoodRating />
        </div>
        <Workout />
      </div>
    </div>
  )
}
