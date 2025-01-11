"use client"

import { useState, useEffect } from 'react'
import { Plus, ChevronDown, Minus } from 'lucide-react'
import { useWorkout } from '@/context/WorkoutContext'

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const defaultWorkouts = [
  {
    id: '1',
    name: 'Push Day',
    day: 'Monday',
    exercises: [
      { id: '1-1', name: 'Bench Press', sets: [{ reps: 12 }] },
      { id: '1-2', name: 'Shoulder Press', sets: [{ reps: 12 }] },
      { id: '1-3', name: 'Tricep Extensions', sets: [{ reps: 12 }] },
      { id: '1-4', name: 'Lateral Raises', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '2',
    name: 'Pull Day',
    day: 'Tuesday',
    exercises: [
      { id: '2-1', name: 'Barbell Rows', sets: [{ reps: 12 }] },
      { id: '2-2', name: 'Pull-ups', sets: [{ reps: 12 }] },
      { id: '2-3', name: 'Bicep Curls', sets: [{ reps: 12 }] },
      { id: '2-4', name: 'Face Pulls', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    day: 'Wednesday',
    exercises: [
      { id: '3-1', name: 'Squats', sets: [{ reps: 12 }] },
      { id: '3-2', name: 'Deadlifts', sets: [{ reps: 12 }] },
      { id: '3-3', name: 'Leg Press', sets: [{ reps: 12 }] },
      { id: '3-4', name: 'Calf Raises', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '4',
    name: 'Upper Body',
    day: 'Thursday',
    exercises: [
      { id: '4-1', name: 'Incline Press', sets: [{ reps: 12 }] },
      { id: '4-2', name: 'Lat Pulldowns', sets: [{ reps: 12 }] },
      { id: '4-3', name: 'Dips', sets: [{ reps: 12 }] },
      { id: '4-4', name: 'Cable Rows', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '5',
    name: 'Lower Body',
    day: 'Friday',
    exercises: [
      { id: '5-1', name: 'Front Squats', sets: [{ reps: 12 }] },
      { id: '5-2', name: 'Romanian Deadlifts', sets: [{ reps: 12 }] },
      { id: '5-3', name: 'Lunges', sets: [{ reps: 12 }] },
      { id: '5-4', name: 'Leg Extensions', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '6',
    name: 'Core & Cardio',
    day: 'Saturday',
    exercises: [
      { id: '6-1', name: 'Planks', sets: [{ reps: 12 }] },
      { id: '6-2', name: 'Russian Twists', sets: [{ reps: 12 }] },
      { id: '6-3', name: 'Mountain Climbers', sets: [{ reps: 12 }] },
      { id: '6-4', name: 'Leg Raises', sets: [{ reps: 12 }] },
    ]
  },
  {
    id: '7',
    name: 'Recovery',
    day: 'Sunday',
    exercises: [
      { id: '7-1', name: 'Stretching', sets: [{ reps: 12 }] },
      { id: '7-2', name: 'Yoga', sets: [{ reps: 12 }] },
      { id: '7-3', name: 'Foam Rolling', sets: [{ reps: 12 }] },
      { id: '7-4', name: 'Light Walking', sets: [{ reps: 12 }] },
    ]
  }
]

export default function WorkoutPage() {
  const { workouts, setWorkouts } = useWorkout()
  const [newWorkoutName, setNewWorkoutName] = useState('')
  
  // Initialize collapsedWorkouts with all workout IDs
  const [collapsedWorkouts, setCollapsedWorkouts] = useState<Set<string>>(() => {
    const initialCollapsed = new Set<string>()
    defaultWorkouts.forEach(workout => initialCollapsed.add(workout.id))
    return initialCollapsed
  })

  useEffect(() => {
    if (workouts.length === 0) {
      setWorkouts(defaultWorkouts)
    }
  }, [workouts.length, setWorkouts])

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
              sets: [{ reps: 12 }]
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
                sets: [...exercise.sets, { reps: 12 }]
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
                <div className="bg-[#fff] rounded-lg">
                  <div onClick={() => toggleWorkout(workout.id)} className="flex justify-between items-center bg-[#FFEAD9] rounded-lg p-2 mb-2">
                    <h3 className="text-[#1E0C02] font-bold">{workout.name}</h3>
                    <button 
                      
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
                    <div className="border border-[#EAEBEB] rounded-lg p-2">
                      {/* Day Selector */}
                      <div className="mb-4">
                        <span className="text-black text-sm mb-2 block">Day</span>
                        <div className="flex flex-wrap gap-2">
                          {days.map(day => (
                            <button
                              key={day}
                              onClick={() => updateWorkoutDay(workout.id, day)}
                              className={`px-3 py-1.5 rounded-full text-sm ${
                                workout.day === day 
                                  ? 'bg-[#F2600C] text-white' 
                                  : 'bg-[#EAEBEB] text-[#5F6666]'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Exercises */}
                      {workout.exercises.map(exercise => (
                        <div key={exercise.id} className="mb-4">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExerciseName(workout.id, exercise.id, e.target.value)}
                            className="text-[12px] font-semibold leading-[120%] tracking-[0.02em] text-black w-full mb-2 bg-transparent"
                          />
                          <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex-1 flex flex-wrap gap-2">
                              {exercise.sets.map((set, index) => (
                                <div 
                                  key={index} 
                                  className="bg-[#EAEBEB] px-3 py-1.5 rounded-lg text-[#5F6666] text-sm flex items-center min-w-[120px]"
                                >
                                  <span className="mr-2 text-[10px] uppercase tracking-wider">Set {index + 1}</span>
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
                                  <span className="ml-1 text-[10px] uppercase tracking-wider">reps</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => addSet(workout.id, exercise.id)}
                                className="p-2 hover:bg-[#EAEBEB] rounded-full transition-colors"
                              >
                                <Plus size={16} className="text-[#F2600C]" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (exercise.sets.length === 1) {
                                    // Delete the exercise if it's the last set
                                    setWorkouts(workouts.map(w => 
                                      w.id === workout.id 
                                        ? { ...w, exercises: w.exercises.filter(e => e.id !== exercise.id) }
                                        : w
                                    ))
                                  } else {
                                    // Remove the last set
                                    removeSet(workout.id, exercise.id, exercise.sets.length - 1)
                                  }
                                }}
                                className="p-2 hover:bg-[#EAEBEB] rounded-full transition-colors"
                              >
                                <Minus size={16} className="text-[#5F6666]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* New Exercise Input */}
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add new exercise"
                          className="flex-1 bg-[#EAEBEB] text-[#5F6666] px-4 py-2 rounded-lg text-sm"
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
                          className="p-2 hover:bg-[#EAEBEB] rounded-full transition-colors"
                        >
                          <Plus size={16} className="text-[#F2600C]" />
                        </button>
                      </div>
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