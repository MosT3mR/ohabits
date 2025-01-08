import Today from "@/components/Today"
import Habits from "@/components/Habits"
import TodoSection from "@/components/TodoSection"
import MoodRating from "@/components/MoodRating"
import Workout from "@/components/Workout"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="mx-auto">
        <Today />
        
        <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4">
          <Habits />
          <TodoSection />
          <MoodRating />
        </div>
        
      </div>
      <Workout />
    </div>
  )
}
