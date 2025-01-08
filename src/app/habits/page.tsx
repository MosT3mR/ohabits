export default function HabitsPage() {
  return (
    <div className="container mx-auto px-4 py-6 mb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Habits</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          New Habit
        </button>
      </div>
      
      <div className="grid gap-4">
        {/* Habit items will go here */}
      </div>
    </div>
  )
} 