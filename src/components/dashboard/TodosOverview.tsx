"use client"

export default function TodosOverview() {
  return (
    <section className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">{"Today's Tasks"}</h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">No tasks for today</p>
      </div>
    </section>
  )
} 