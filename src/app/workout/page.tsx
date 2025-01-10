"use client"

import { useState } from 'react'
import { Plus, ChevronDown, Minus } from 'lucide-react'
import { useWorkout } from '@/context/WorkoutContext'

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function WorkoutPage() {
  const { workouts, setWorkouts } = useWorkout()
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [showDaySelector, setShowDaySelector] = useState<string | null>(null)
  const [collapsedWorkouts, setCollapsedWorkouts] = useState<Set<string>>(new Set())

  const addWorkout = () => {
    if (!newWorkoutName.trim()) return
    
    setWorkouts([
      ...workouts,
      {
        id: Date.now().toString(),
        name: newWorkoutName,
        day: 'Saturday', // Default day
        exercises: []
      }
    ])
    setNewWorkoutName('')
  }

  const updateWorkoutDay = (workoutId: string, day: string) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId ? { ...workout, day } : workout
    ))
    setShowDaySelector(null)
  }

  const addExercise = (workoutId: string, exerciseName: string) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: [
            ...workout.exercises,
            {
              id: Date.now().toString(),
              name: exerciseName,
              sets: [{ reps: 12, weight: 0 }]
            }
          ]
        }
      }
      return workout
    }))
  }

  const updateExerciseName = (workoutId: string, exerciseId: string, name: string) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => 
            exercise.id === exerciseId ? { ...exercise, name } : exercise
          )
        }
      }
      return workout
    }))
  }

  const updateReps = (workoutId: string, exerciseId: string, setIndex: number, reps: number) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.map((set, idx) => 
                  idx === setIndex ? { ...set, reps } : set
                )
              }
            }
            return exercise
          })
        }
      }
      return workout
    }))
  }

  const addSet = (workoutId: string, exerciseId: string) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: [...exercise.sets, { reps: 12, weight: 0 }]
              }
            }
            return exercise
          })
        }
      }
      return workout
    }))
  }

  const removeSet = (workoutId: string, exerciseId: string, setIndex: number) => {
    setWorkouts(workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.filter((_, index) => index !== setIndex)
              }
            }
            return exercise
          })
        }
      }
      return workout
    }))
  }

  const toggleWorkout = (workoutId: string) => {
    setCollapsedWorkouts(prev => {
      const next = new Set(prev)
      if (next.has(workoutId)) {
        next.delete(workoutId)
      } else {
        next.add(workoutId)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="bg-white rounded-lg p-4">
          <h1 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02] mb-4">
            Workout
          </h1>

          {/* Workouts List */}
          <div className="space-y-4">
            {workouts.map(workout => (
              <div key={workout.id}>
                <div className="bg-[#FFEAD9] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[#1E0C02] font-bold">{workout.name}</h3>
                    <button 
                      onClick={() => toggleWorkout(workout.id)}
                      className="p-1"
                    >
                      <ChevronDown 
                        size={16} 
                        className={`text-black transform transition-transform ${
                          !collapsedWorkouts.has(workout.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {!collapsedWorkouts.has(workout.id) && (
                    <>
                      {/* Day Selector */}
                      <div className="relative mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-black text-sm">Day</span>
                          <button 
                            className="bg-[#EAEBEB] px-4 py-2 rounded flex items-center space-x-2"
                            onClick={() => setShowDaySelector(workout.id)}
                          >
                            <span className="text-[#5F6666]">{workout.day}</span>
                            <ChevronDown size={16} className="text-[#5F6666]" />
                          </button>
                        </div>

                        {showDaySelector === workout.id && (
                          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 z-10">
                            {days.map(day => (
                              <button
                                key={day}
                                className="block w-full text-left px-4 py-2 hover:bg-[#EAEBEB] rounded"
                                onClick={() => updateWorkoutDay(workout.id, day)}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Exercises */}
                      {workout.exercises.map(exercise => (
                        <div key={exercise.id} className="mb-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) => updateExerciseName(workout.id, exercise.id, e.target.value)}
                              className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black w-24 bg-transparent"
                            />
                            <div className="flex-1 flex items-center space-x-2">
                              {exercise.sets.map((set, index) => (
                                <div key={index} className="bg-[#EAEBEB] px-4 py-2 rounded text-[#5F6666] text-sm flex items-center">
                                  <span className="mr-1">REPS</span>
                                  <input
                                    type="number"
                                    value={set.reps}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0
                                      updateReps(workout.id, exercise.id, index, value)
                                    }}
                                    className="w-12 bg-transparent text-center"
                                    min="0"
                                  />
                                </div>
                              ))}
                            </div>
                            <button onClick={() => addSet(workout.id, exercise.id)}>
                              <Plus size={16} className="text-black" />
                            </button>
                            <button onClick={() => exercise.sets.length > 1 && removeSet(workout.id, exercise.id, exercise.sets.length - 1)}>
                              <Minus size={16} className="text-black" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* New Exercise Input */}
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="NEW WORKOUT"
                          className="flex-1 bg-[#EAEBEB] text-[#5F6666] px-4 py-2 rounded"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addExercise(workout.id, e.currentTarget.value.trim())
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <button 
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            if (input && input.value.trim()) {
                              addExercise(workout.id, input.value.trim())
                              input.value = ''
                            }
                          }}
                          className="p-2"
                        >
                          <Plus size={16} className="text-black" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Workout */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              placeholder="New Workout..."
              className="flex-1 bg-[#EAEBEB] px-4 py-2 rounded text-[#5F6666]"
            />
            <button onClick={addWorkout}>
              <Plus size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 