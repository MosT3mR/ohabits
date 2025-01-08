import HabitsOverview from "@/components/dashboard/HabitsOverview"
import TodosOverview from "@/components/dashboard/TodosOverview"
import WorkoutSummary from "@/components/dashboard/WorkoutSummary"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 mb-16">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6">
        <HabitsOverview />
        <TodosOverview />
        <WorkoutSummary />
        
        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Journal</h2>
          {/* Journal entries preview */}
        </section>
        
        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-4">Health Metrics</h2>
          {/* Health metrics chart */}
        </section>
      </div>
    </div>
  )
} 