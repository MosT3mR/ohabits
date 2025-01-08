"use client"

import React from 'react'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'

interface Exercise {
  name: string
  sets: Array<{
    weight: number
    reps: number
  }>
}

interface WorkoutProps {
  date?: string
  weight?: string
}

export default function Workout({ date, weight }: WorkoutProps) {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      name: 'Squat',
      sets: [
        { weight: 120, reps: 12 },
        { weight: 130, reps: 10 },
        { weight: 140, reps: 8 },
      ],
    },
    {
      name: 'Leg Press',
      sets: [
        { weight: 120, reps: 12 },
        { weight: 130, reps: 10 },
        { weight: 140, reps: 8 },
      ],
    },
    {
      name: 'Leg Extension',
      sets: [
        { weight: 120, reps: 12 },
        { weight: 130, reps: 10 },
        { weight: 140, reps: 8 },
      ],
    }
  ])
  const [cardioName, setCardioName] = useState('Stair master')
  const [cardioDuration, setCardioDuration] = useState(30)

  return (
    <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-1 text-center">Workout</h2>
          <div className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] inline-block mx-[170px] flex justify-center text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase">
            {weight || 'YOUR WEIGHT TODAY'}
          </div>
        </div>

        {/* Workout Plan */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black w-20">Today's plan</span>
            <div className="ml-2 bg-[#EAEBEB] rounded py-2 px-2 text-[#5F6666] text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase flex items-center w-full">
              <span className="flex-1">Legs & ABS</span>
              <button className="ml-2">
                <Image src="/svg/down.svg" alt="down" width={16} height={16} />
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="border border-[#5F6666] rounded-lg p-4 space-y-3">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-[10px] font-semibold leading-[120%] tracking-[0.02em] text-black w-20">{exercise.name}</span>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-[10px] font-semibold leading-[120%] tracking-[0.08em] uppercase">
                    {set.weight}KG x {set.reps}
                  </div>
                ))}
                <button className="p-1">
                  <Plus className="text-[#000]" size={16} />
                </button>
                <button className="p-1">
                  <Minus className="text-[#000]" size={16} />
                </button>
              </div>
            ))}
            
            {/* New Workout Button */}
            <div className="flex items-center">
              <div className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm">
                NEW WORKOUT
              </div>
              <button className="ml-2 p-1 text-[#000]">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Cardio Section */}
        <div className="space-y-4 pb-7">
          <h3 className="text-[#1E0C02] text-xl">Cardio</h3>
          <div className="flex items-center space-x-2">
            <div className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm">
              {cardioName}
            </div>
            <div className="bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm">
              {cardioDuration} min
            </div>
            <button className="p-1">
              <Plus className="text-[#000]" size={16} />
            </button>
            <button className="p-1">
              <Minus className="text-[#000]" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 