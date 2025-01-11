"use client"

import { useWorkout } from '@/context/WorkoutContext'

export default function WorkoutSummary() {
  const { workouts } = useWorkout()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayWorkout = workouts.find(workout => workout.day === today)

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Today&apos;s Workout</h2>
      {todayWorkout ? (
        <div>
          <h3 className="font-medium mb-2">{todayWorkout.name}</h3>
          <div className="space-y-2">
            {todayWorkout.exercises.map(exercise => (
              <div key={exercise.id} className="text-sm text-gray-600">
                {exercise.name} - {exercise.sets.length} sets
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No workout scheduled for today</p>
      )}
    </div>
  )
} 