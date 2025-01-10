"use client"

import { useWorkout } from '@/context/WorkoutContext'

export default function WorkoutSummary() {
  const { workouts, selectedDay } = useWorkout()
  const todayWorkout = workouts.find(workout => workout.day === selectedDay)

  return (
    <section className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Workout Summary</h2>
      {todayWorkout ? (
        <div>
          <p className="text-sm text-gray-600">Today's Workout</p>
          <p className="text-xl font-medium">{todayWorkout.name}</p>
          <p className="text-sm text-gray-600 mt-2">
            {todayWorkout.exercises.length} exercises planned
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">No workout scheduled for today</p>
      )}
    </section>
  )
} 