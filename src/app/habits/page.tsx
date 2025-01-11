"use client"

import { useState } from 'react'
import { useHabits } from '@/context/HabitsContext'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitDay, deleteHabit, updateHabitName } = useHabits()
  const [newHabitName, setNewHabitName] = useState('')
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabitName.trim()) return
    await addHabit(newHabitName)
    setNewHabitName('')
  }

  const handleStartEdit = (habit: { id: string, name: string }) => {
    setEditingHabitId(habit.id)
    setEditingName(habit.name)
  }

  const handleSaveEdit = async (habitId: string) => {
    if (editingName.trim()) {
      await updateHabitName(habitId, editingName)
    }
    setEditingHabitId(null)
  }

  const handleCancelEdit = () => {
    setEditingHabitId(null)
    setEditingName('')
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="bg-white rounded-lg p-4 space-y-6">
          <h1 className="text-[23px] font-bold leading-[122%] tracking-[-0.02em] text-[#1e0c02]">
            Habits
          </h1>

          {/* Add New Habit Form */}
          <form onSubmit={handleAddHabit} className="flex gap-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Add new habit"
              className="flex-1 px-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] text-[#1e0c02]"
            />
            <button
              type="submit"
              className="p-2 bg-[#F2600C] text-white rounded hover:bg-[#d65209]"
            >
              <Plus size={24} />
            </button>
          </form>

          {/* Habits List */}
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {editingHabitId === habit.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-4 py-2 rounded bg-[#FEF7F3] border border-[#EAEBEB] text-[#1e0c02]"
                      />
                      <button
                        onClick={() => handleSaveEdit(habit.id)}
                        className="p-2 text-green-600 hover:bg-[#FEF7F3] rounded"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-red-600 hover:bg-[#FEF7F3] rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-[#1e0c02]">{habit.name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(habit)}
                          className="p-2 text-[#1e0c02] hover:bg-[#FEF7F3] rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="p-2 text-red-600 hover:bg-[#FEF7F3] rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {days.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleHabitDay(habit.id, index)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        habit.scheduledDays[index]
                          ? 'bg-[#F2600C] text-white'
                          : 'bg-[#FEF7F3] text-[#1e0c02] border border-[#EAEBEB]'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 