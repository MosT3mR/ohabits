"use client"

import { useState, useEffect } from 'react'
import { Save, Edit2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/context/AuthContext'

export default function Notes() {
  const [note, setNote] = useState('')
  const [isEditing, setIsEditing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasExistingNote, setHasExistingNote] = useState(false)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTodayNote()
    }
  }, [user])

  const fetchTodayNote = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching note:', error)
        return
      }

      if (data) {
        setNote(data.content)
        setIsEditing(false)
        setHasExistingNote(true)
      } else {
        setIsEditing(true)
        setHasExistingNote(false)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNote = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const { error } = await supabase
        .from('notes')
        .upsert({
          user_id: user.id,
          date: today,
          content: note.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        })

      if (error) {
        console.error('Error saving note:', error)
        return
      }

      setIsEditing(false)
      setHasExistingNote(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
        <div className="text-center py-8 text-gray-500">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#1E0C02] text-[23px] font-bold">Daily Notes</h2>
        {hasExistingNote && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-[#EAEBEB] rounded-full transition-colors"
          >
            <Edit2 size={16} className="text-[#F2600C]" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your daily note here..."
            className="w-full h-32 bg-[#EAEBEB] rounded-lg p-4 text-[#5F6666] text-sm resize-none"
          />
          <button
            onClick={saveNote}
            disabled={!note.trim()}
            className="w-full bg-[#F2600C] text-white py-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            Save Note
          </button>
        </div>
      ) : (
        <div className="bg-[#EAEBEB] rounded-lg p-4">
          <p className="text-[#5F6666] text-sm whitespace-pre-wrap">{note}</p>
        </div>
      )}
    </div>
  )
} 