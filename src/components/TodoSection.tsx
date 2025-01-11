"use client"

import { useState } from 'react'

export default function TodoSection() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Morning workout', completed: true },
    { id: 2, text: 'Read for 30 minutes', completed: false },
    { id: 3, text: 'Meditate', completed: true },
  ])

  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    
    setTodos(prev => [...prev, {
      id: Math.max(...prev.map(t => t.id), 0) + 1,
      text: newTodo,
      completed: false
    }])
    setNewTodo('')
  }

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="space-y-4 pb-7">
      <h3 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center pt-4">Today&apos;s Tasks</h3>
      <div className="space-y-2">
        {todos.map(todo => (
          <button
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`w-full p-3 rounded flex items-center justify-between ${
              todo.completed 
                ? 'bg-[#F2600C] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-white' 
                : 'bg-[#FEF7F3] font-semibold text-[10px] leading-[120%] tracking-[0.02em] text-[#5F6666]'
            }`}
          >
            <span>{todo.text}</span>
            {todo.completed && <span>✓</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 p-3 rounded bg-[#FEF7F3] text-[10px] leading-[120%] tracking-[0.02em] text-[#5F6666] placeholder:text-[#5F6666]"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="px-4 py-2 bg-[#F2600C] text-white rounded text-[10px] leading-[120%] tracking-[0.02em]"
        >
          Add
        </button>
      </div>
    </div>
  )
} 