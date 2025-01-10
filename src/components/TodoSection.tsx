"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Checkbox } from './ui/checkbox'

export default function TodoSection() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Morning workout', completed: false },
    { id: 2, text: 'Read for 30 minutes', completed: false },
    { id: 3, text: 'Meditate', completed: true },
  ])

  const [showAddTodo, setShowAddTodo] = useState(false)
  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    
    setTodos(prev => [...prev, {
      id: Math.max(...prev.map(t => t.id), 0) + 1,
      text: newTodo,
      completed: false
    }])
    setNewTodo('')
    setShowAddTodo(false)
  }

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="space-y-4 pb-7">
      <h3 className="text-[#1E0C02] text-xl">Today&apos;s Tasks</h3>
      <div className="space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      {showAddTodo ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
            className="w-full p-2 border rounded"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTodo}
              className="px-4 py-2 bg-[#F2600C] text-white rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddTodo(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddTodo(true)}
          className="flex items-center gap-2 text-sm text-[#F2600C]"
        >
          <Plus size={16} />
          Add Task
        </button>
      )}
    </div>
  )
} 