"use client"

import { useState } from 'react'
import { Square, CheckSquare } from 'lucide-react'

interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskListProps {
  title: string
  tasks: Task[]
}

export default function TaskList({ title, tasks }: TaskListProps) {
  const [taskList, setTaskList] = useState(tasks)

  return (
    <div className="mt-4">
      <h2 className="text-[#1E0C02] text-[23px] font-bold leading-[122%] tracking-[-0.02em] mb-4 text-center">{title}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {taskList.map((task) => (
          <div key={task.id} className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setTaskList(taskList.map(t => 
                  t.id === task.id ? {...t, completed: !t.completed} : t
                ))
              }}
              className="text-[#2A3433] hover:opacity-75"
            >
              {task.completed ? (
                <CheckSquare size={20} />
              ) : (
                <Square size={20} />
              )}
            </button>
            <span className="text-[#5f6666] text-[10px] font-semibold leading-[120%] tracking-[0.02em]">{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 