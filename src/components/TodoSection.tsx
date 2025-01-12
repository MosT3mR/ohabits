"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useSelectedDate } from '@/context/SelectedDateContext'

interface Todo {
  id: string
  text: string
  completed: boolean
  date: string
  user_id: string
}

export default function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { supabase, user } = useSupabase()
  const { selectedDate, formattedDate } = useSelectedDate()
  const today = new Date()
  const isToday = formattedDate === new Date(
    today.getTime() - (today.getTimezoneOffset() * 60000)
  ).toISOString().split('T')[0]

  // Fetch todos for selected date
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', formattedDate)

        if (error) throw error

        setTodos(data || [])
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [supabase, user, formattedDate])

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: newTodo,
          completed: false,
          date: formattedDate,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      if (data) {
        setTodos(prev => [...prev, data])
        setNewTodo('')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: string) => {
    if (!user) return

    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <div className="space-y-4 pb-7">
      <h3 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center pt-4">
        {isToday ? "Today's Tasks" : `Tasks for ${selectedDate.toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'}).split('/').join(' / ')}`}
      </h3>
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