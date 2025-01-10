"use client"

import { useState } from 'react'
import TaskList from './TaskList'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Call Othman', completed: false },
    { id: '2', text: 'Reroll in discord', completed: false },
    { id: '3', text: 'Buy milk', completed: false },
  ])
  const [newTodo, setNewTodo] = useState('')
  const [note, setNote] = useState('')

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      }
    ])
    setNewTodo('')
  }

  return (
    <div className="space-y-4 pb-7">
      <h3 className="text-[#1E0C02] text-xl">{"Today's Tasks"}</h3>
      <TaskList title="Todo's" tasks={todos} />
      
      {/* Add Todo Input */}
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow p-2 rounded border-2 border-[#2A3433] bg-transparent text-sm placeholder:text-[#5F6666] text-[#000]"
        />
        <button 
          type="submit"
          className="px-4 py-2 bg-[#2A3433] text-white rounded text-sm"
        >
          Add
        </button>
      </form>

      {/* Today's Note */}
      <div>
        <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">Today's note</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type what's in your mind..."
          className="w-full h-32 p-3 rounded bg-[#F4F4F4] border-none text-sm text-[#5F6666] resize-none"
        />
      </div>
    </div>
  )
} 