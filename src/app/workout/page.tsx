"use client"

import { useState, useEffect } from 'react'
import { Plus, ChevronDown, Minus, Edit2, Save, Trash2 } from 'lucide-react'
import { useWorkout } from '@/context/WorkoutContext'

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function WorkoutPage() {
  const { workouts, saveWorkout, deleteWorkout, updateWorkout } = useWorkout()
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [collapsedWorkouts, setCollapsedWorkouts] = useState<Set<string>>(new Set())
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    const initialCollapsed = new Set(workouts.map(w => w.id))
    setCollapsedWorkouts(initialCollapsed)
  }, [workouts])

  const addWorkout = async () => {
    if (!newWorkoutName.trim()) return
    
    const result = await saveWorkout({
      name: newWorkoutName,
      day: 'Saturday',
      exercises: []
    })
    
    if (result?.id) {
      setCollapsedWorkouts(prev => {
        const next = new Set(prev)
        next.add(result.id)
        return next
      })
    }
    
    setNewWorkoutName('')
  }

  const updateWorkoutDay = async (workoutId: string, day: string) => {
    await updateWorkout(workoutId, { day })
  }

  const addExercise = async (workoutId: string, exerciseName: string) => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) return

    await updateWorkout(workoutId, {
      exercises: [
        ...workout.exercises,
        {
          id: Date.now().toString(),
          name: exerciseName,
          sets: [{ reps: 12, weight: 0 }]
        }
      ]
    })
  }

  const updateExerciseName = async (workoutId: string, exerciseId: string, name: string) => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) return

    await updateWorkout(workoutId, {
      exercises: workout.exercises.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, name } : exercise
      )
    })
  }

  const updateReps = async (workoutId: string, exerciseId: string, setIndex: number, reps: number) => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) return

    await updateWorkout(workoutId, {
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
    })
  }

  const addSet = async (workoutId: string, exerciseId: string) => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) return

    await updateWorkout(workoutId, {
      exercises: workout.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [...exercise.sets, { reps: 12, weight: 0 }]
          }
        }
        return exercise
      })
    })
  }

  const removeSet = async (workoutId: string, exerciseId: string, setIndex: number) => {
    const workout = workouts.find(w => w.id === workoutId)
    if (!workout) return

    await updateWorkout(workoutId, {
      exercises: workout.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter((_, index) => index !== setIndex)
          }
        }
        return exercise
      })
    })
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

  const handleStartEdit = (workout: typeof workouts[0]) => {
    setEditingWorkoutId(workout.id)
    setEditingName(workout.name)
  }

  const handleSaveEdit = async () => {
    if (editingWorkoutId && editingName.trim()) {
      try {
        await updateWorkout(editingWorkoutId, { name: editingName.trim() })
        setEditingWorkoutId(null)
        setEditingName('')
      } catch (error) {
        console.error('Error updating workout name:', error)
        alert('Failed to update workout name')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingWorkoutId(null)
    setEditingName('')
  }

  const handleDeleteWorkout = async (workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(workoutId)
      } catch (error) {
        console.error('Error deleting workout:', error)
        alert('Failed to delete workout')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="bg-white rounded-lg p-4">
          <h1 className="text-center font-bold text-[23px] leading-[122%] tracking-[-0.02em] text-[#1e0c02] mb-4">
            Workout Plans
          </h1>

          {/* Workouts List */}
          {workouts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No workout plans yet. Create your first one below!
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map(workout => (
                <div key={workout.id}>
                  <div className="bg-[#fff] rounded-lg">
                    <div className="flex justify-between items-center bg-[#FFEAD9] rounded-lg p-2 mb-2">
                      {editingWorkoutId === workout.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 bg-transparent text-[#1E0C02] font-bold px-2 py-1 rounded"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 hover:bg-[#E0E1E1] rounded text-green-600"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 hover:bg-[#E0E1E1] rounded text-red-600"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <h3 className="text-[#1E0C02] font-bold">{workout.name}</h3>
                          <button
                            onClick={() => handleStartEdit(workout)}
                            className="p-1 hover:bg-[#E0E1E1] rounded text-[#000]"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkout(workout.id)}
                            className="p-1 hover:bg-[#E0E1E1] rounded text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
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
                                      deleteWorkout(workout.id)
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
          )}

          {/* Add New Workout */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              placeholder="New Workout Plan..."
              className="flex-1 bg-[#EAEBEB] px-4 py-2 rounded text-[#5F6666]"
            />
            <button 
              className="px-4 py-2 bg-[#F2600C] text-white rounded text-[16px] leading-[120%] tracking-[0.02em]" 
              onClick={addWorkout}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 