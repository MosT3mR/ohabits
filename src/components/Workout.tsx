"use client"

import React from 'react'
import { useState } from 'react'
import { Plus, Minus, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useWorkout } from '@/context/WorkoutContext'

interface WorkoutProps {
  date?: string
  weight?: string
}

export default function Workout({ date, weight }: WorkoutProps) {
  const { workouts, selectedDay, setSelectedDay, setWorkouts } = useWorkout()
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [cardioExercises, setCardioExercises] = useState<Array<{name: string, minutes: number}>>([
    { name: '', minutes: 0 }
  ]);
  
  // Find today's workout based on selectedDay
  const todayWorkout = workouts.find(workout => workout.day === selectedDay)

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const addSet = (exerciseId: string) => {
    setWorkouts(workouts.map(workout => {
      if (workout.day === selectedDay) {
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

  const removeSet = (exerciseId: string) => {
    setWorkouts(workouts.map(workout => {
      if (workout.day === selectedDay) {
        return {
          ...workout,
          exercises: workout.exercises.map(exercise => {
            if (exercise.id === exerciseId && exercise.sets.length > 1) {
              return {
                ...exercise,
                sets: exercise.sets.slice(0, -1)
              }
            }
            return exercise
          })
        }
      }
      return workout
    }))
  }

  const updateCardioName = (index: number, name: string) => {
    const newCardio = [...cardioExercises];
    newCardio[index].name = name;
    setCardioExercises(newCardio);
  };

  const updateCardioMinutes = (index: number, minutes: number) => {
    const newCardio = [...cardioExercises];
    newCardio[index].minutes = minutes;
    setCardioExercises(newCardio);
  };

  const addCardio = () => {
    setCardioExercises([...cardioExercises, { name: '', minutes: 0 }]);
  };

  const removeCardio = (index: number) => {
    setCardioExercises(cardioExercises.filter((_, i) => i !== index));
  };

  if (!todayWorkout) {
    return (
      <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
        <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-1 text-center">
          No Workout Scheduled
        </h2>
      </div>
    )
  }

  return (
    <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-1 text-center">
            {todayWorkout.name}
          </h2>
          <div className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] inline-block text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase mx-auto flex justify-center items-center w-fit">
            {weight || 'YOUR WEIGHT TODAY'}
          </div>
        </div>

        {/* Workout Plan */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black w-20">Today's plan</span>
            <div className="relative w-full">
              <button 
                className="ml-2 bg-[#EAEBEB] rounded py-2 px-2 text-[#5F6666] text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase flex items-center w-full"
                onClick={() => setShowDaySelector(!showDaySelector)}
              >
                <span className="flex-1 text-[#000]">{todayWorkout.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showDaySelector && (
                <div className="text-[#000] absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10">
                  {days.map(day => {
                    const workout = workouts.find(w => w.day === day)
                    return (
                      <button
                        key={day}
                        className="w-full text-left px-4 py-2 hover:bg-[#EAEBEB] text-sm"
                        onClick={() => {
                          setSelectedDay(day)
                          setShowDaySelector(false)
                        }}
                      >
                        {workout ? `${day} - ${workout.name}` : day}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Exercise List */}
          <div className="border border-[#5F6666] rounded-lg p-4 space-y-3">
            {todayWorkout.exercises.map((exercise, index) => (
              <div key={exercise.id} className="flex flex-col space-y-2">
                <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black">
                  {exercise.name}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex flex-wrap gap-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase">
                        {set.weight}KG x {set.reps}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => addSet(exercise.id)}
                    className="p-1 hover:bg-[#EAEBEB] rounded"
                  >
                    <Plus className="text-[#000]" size={16} />
                  </button>
                  {exercise.sets.length > 1 && (
                    <button 
                      onClick={() => removeSet(exercise.id)}
                      className="p-1 hover:bg-[#EAEBEB] rounded"
                    >
                      <Minus className="text-[#000]" size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cardio Section */}
        <div className="space-y-4 pb-7">
          <h3 className="text-[#1E0C02] text-xl">Cardio</h3>
          <div className="flex flex-col space-y-3">
            {cardioExercises.map((cardio, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cardio.name}
                  onChange={(e) => updateCardioName(index, e.target.value)}
                  placeholder="Cardio name"
                  className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
                />
                <input
                  type="number"
                  value={cardio.minutes}
                  onChange={(e) => updateCardioMinutes(index, parseInt(e.target.value))}
                  placeholder="Minutes"
                  className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm w-24"
                />
                <button 
                  onClick={addCardio}
                  className="p-1 hover:bg-[#EAEBEB] rounded"
                >
                  <Plus className="text-[#000]" size={16} />
                </button>
                {cardioExercises.length > 1 && (
                  <button 
                    onClick={() => removeCardio(index)}
                    className="p-1 hover:bg-[#EAEBEB] rounded"
                  >
                    <Minus className="text-[#000]" size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 