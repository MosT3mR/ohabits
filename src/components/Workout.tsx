"use client"

import { useState, useEffect } from 'react'
import { Plus, Minus, ChevronDown, Save, Edit2, Trash2 } from 'lucide-react'
import { useWorkout } from '@/context/WorkoutContext'
import { useSelectedDate } from '@/context/SelectedDateContext'

interface Exercise {
  id: string
  name: string
  sets: Array<{
    reps: number
    weight: number
  }>
}

// Used in logWorkout parameter type
interface WorkoutLog {
  workout_id: string
  completed_exercises: Exercise[]
  cardio: Array<{ name: string, minutes: number }>
  weight: string
  date: string
  notes?: string
}

export default function Workout() {
  const { workouts, logWorkout, getTodayWorkout } = useWorkout()
  const { selectedDate, formattedDate } = useSelectedDate()
  const [selectedWorkout, setSelectedWorkout] = useState<typeof workouts[0] | null>(null)
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false)
  const [weight, setWeight] = useState<string>('')
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([])
  const [cardioExercises, setCardioExercises] = useState<Array<{name: string, minutes: number}>>([
    { name: '', minutes: 0 }
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const day = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const today = new Date()
  const isToday = formattedDate === new Date(
    today.getTime() - (today.getTimezoneOffset() * 60000)
  ).toISOString().split('T')[0]

  // Load workout log if it exists
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const todayLog = await getTodayWorkout()
        if (todayLog) {
          const workout = workouts.find(w => w.id === todayLog.workout_id)
          if (workout) {
            setSelectedWorkout(workout)
            setCompletedExercises(todayLog.completed_exercises)
            setCardioExercises(todayLog.cardio)
            setWeight(todayLog.weight)
          }
        } else {
          // If no workout logged, set the suggested workout for the day
          const suggestedWorkout = workouts.find(w => w.day.toLowerCase() === day)
          if (suggestedWorkout) {
            setSelectedWorkout(suggestedWorkout)
            setCompletedExercises(
              suggestedWorkout.exercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                sets: ex.sets.map(set => ({ ...set, weight: 0 }))
              }))
            )
          }
        }
      } catch (error) {
        console.error('Error loading workout:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (workouts.length > 0) {
      loadWorkout()
    }
  }, [workouts, day, getTodayWorkout, formattedDate])

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newExercises = [...completedExercises]
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      [field]: value
    }
    setCompletedExercises(newExercises)
  }

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...completedExercises]
    newExercises[exerciseIndex].sets.push({ reps: 0, weight: 0 })
    setCompletedExercises(newExercises)
  }

  const removeSet = (exerciseIndex: number) => {
    const newExercises = [...completedExercises]
    if (newExercises[exerciseIndex].sets.length > 1) {
      newExercises[exerciseIndex].sets.pop()
      setCompletedExercises(newExercises)
    }
  }

  const updateCardioName = (index: number, name: string) => {
    const newCardio = [...cardioExercises]
    newCardio[index].name = name
    setCardioExercises(newCardio)
  }

  const updateCardioMinutes = (index: number, minutes: number) => {
    const newCardio = [...cardioExercises]
    newCardio[index].minutes = minutes
    setCardioExercises(newCardio)
  }

  const addCardio = () => {
    setCardioExercises([...cardioExercises, { name: '', minutes: 0 }])
  }

  const removeCardio = (index: number) => {
    setCardioExercises(cardioExercises.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!selectedWorkout || !weight) {
      alert('Please select a workout and enter your weight')
      return
    }

    const workoutLog: WorkoutLog = {
      date: formattedDate,
      workout_id: selectedWorkout.id,
      completed_exercises: completedExercises,
      cardio: cardioExercises,
      weight: weight,
      notes: `Weight: ${weight}kg`
    }

    try {
      await logWorkout(workoutLog)
      alert('Workout logged successfully!')
    } catch (error) {
      console.error('Error logging workout:', error)
      alert('Failed to log workout')
    }
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: 'New Exercise',
      sets: [{ reps: 0, weight: 0 }]
    }
    setCompletedExercises([...completedExercises, newExercise])
  }

  const deleteExercise = (exerciseIndex: number) => {
    setCompletedExercises(prev => prev.filter((_, index) => index !== exerciseIndex))
  }

  const handleStartEdit = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id)
    setEditingName(exercise.name)
  }

  const handleSaveEdit = (exerciseIndex: number) => {
    const newExercises = [...completedExercises]
    newExercises[exerciseIndex].name = editingName
    setCompletedExercises(newExercises)
    setEditingExerciseId(null)
  }

  const handleCancelEdit = () => {
    setEditingExerciseId(null)
    setEditingName('')
  }

  if (isLoading) {
    return (
      <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
        <div className="text-center py-8 text-gray-500">
          Loading workout...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
      <div className="space-y-4">
        {/* Header with Workout Selector */}
        <div>
          <div className="relative mb-4">
            <button 
              onClick={() => setShowWorkoutSelector(!showWorkoutSelector)}
              className="w-full flex items-center justify-between bg-[#EAEBEB] rounded px-4 py-2"
            >
              <span className="text-[#1E0C02] text-[23px] font-bold">
                {selectedWorkout?.name || "Select Workout"}
              </span>
              <ChevronDown className={`transform transition-transform ${showWorkoutSelector ? 'rotate-180' : ''}`} />
            </button>
            
            {showWorkoutSelector && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-[#EAEBEB]">
                {workouts.map(workout => (
                  <button
                    key={workout.id}
                    onClick={() => {
                      setSelectedWorkout(workout)
                      setShowWorkoutSelector(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#EAEBEB] text-[#1E0C02] ${
                      workout.day === day ? 'font-bold' : ''
                    }`}
                  >
                    {workout.name} {workout.day === day ? '(Suggested)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight (kg)"
            className="w-full bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
          />
        </div>

        {selectedWorkout ? (
          <>
            {/* Exercise List */}
            <div className="border border-[#5F6666] rounded-lg p-4 space-y-3">
              {completedExercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    {editingExerciseId === exercise.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="bg-[#EAEBEB] rounded px-2 py-1 text-sm text-[#000]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(exerciseIndex)}
                          className="p-1 hover:bg-[#EAEBEB] rounded text-green-600"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:bg-[#EAEBEB] rounded text-red-600"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black">
                          {exercise.name}
                        </span>
                        <button
                          onClick={() => handleStartEdit(exercise)}
                          className="p-1 hover:bg-[#EAEBEB] rounded text-[#000]"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteExercise(exerciseIndex)}
                          className="p-1 hover:bg-[#EAEBEB] rounded text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex flex-wrap gap-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-2 bg-[#EAEBEB] rounded px-4 py-2">
                          <input
                            type="number"
                            value={set.weight || 0}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                            placeholder="kg"
                            className="w-16 bg-transparent text-[#5F6666] text-sm text-center"
                          />
                          <span className="text-[#5F6666] text-sm">kg x</span>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                            placeholder="reps"
                            className="w-16 bg-transparent text-[#5F6666] text-sm text-center"
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => addSet(exerciseIndex)}
                      className="p-1 hover:bg-[#EAEBEB] rounded"
                    >
                      <Plus className="text-[#000]" size={16} />
                    </button>
                    {exercise.sets.length > 1 && (
                      <button 
                        onClick={() => removeSet(exerciseIndex)}
                        className="p-1 hover:bg-[#EAEBEB] rounded"
                      >
                        <Minus className="text-[#000]" size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Exercise Button */}
              <button
                onClick={addExercise}
                className="w-full mt-2 py-2 px-4 bg-[#EAEBEB] hover:bg-[#E0E1E1] rounded flex items-center justify-center gap-2 text-sm text-[#000]"
              >
                <Plus size={16} />
                Add Exercise
              </button>
            </div>

            {/* Cardio Section */}
            <div className="space-y-4">
              <h3 className="text-[#1E0C02] text-xl">
                {isToday ? "Cardio" : `Cardio for ${selectedDate.toLocaleDateString()}`}
              </h3>
              <div className="flex flex-col space-y-3">
                {cardioExercises.map((cardio, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={cardio.name}
                      onChange={(e) => updateCardioName(index, e.target.value)}
                      placeholder="Cardio name"
                      className="flex-1 bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
                    />
                    <input
                      type="number"
                      value={cardio.minutes}
                      onChange={(e) => updateCardioMinutes(index, parseInt(e.target.value))}
                      placeholder="Minutes"
                      className="w-24 bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
                    />
                    <button onClick={addCardio} className="p-1 hover:bg-[#EAEBEB] rounded">
                      <Plus className="text-[#000]" size={16} />
                    </button>
                    {cardioExercises.length > 1 && (
                      <button onClick={() => removeCardio(index)} className="p-1 hover:bg-[#EAEBEB] rounded">
                        <Minus className="text-[#000]" size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#F2600C] text-white py-3 rounded font-semibold flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Log Workout
            </button>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Select a workout to begin logging
          </div>
        )}
      </div>
    </div>
  )
} 