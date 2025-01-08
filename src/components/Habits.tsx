"use client"

import TaskList from './TaskList'

const defaultHabits = [
  { id: '1', text: 'Reading', completed: false },
  { id: '2', text: 'Fast typing', completed: false },
  { id: '3', text: 'Learn Rust', completed: false },
  { id: '4', text: 'Learn Dutch', completed: false },
  { id: '5', text: 'Work on startup', completed: false },
]

export default function Habits() {
  return <TaskList title="Habits" tasks={defaultHabits} />
} 