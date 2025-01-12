"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/context/AuthContext'
import { Save, Upload, User } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user?.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError)
        return
      }

      if (profile) {
        setDisplayName(profile.display_name || '')
        setAvatar(profile.avatar_url)
      }

      // Set email from auth user
      setEmail(user?.email || '')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || !event.target.files[0]) return

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `avatars/${user?.id}.${fileExt}`  // Add avatars/ prefix back

      // First, try to remove any existing avatar if we have one
      if (avatar) {
        try {
          const existingPath = new URL(avatar).pathname.split('/').pop()
          if (existingPath) {
            await supabase.storage
              .from('avatars')
              .remove([`avatars/${existingPath}`])  // Add avatars/ prefix
          }
        } catch (error) {
          console.error('Error removing existing avatar:', error)
          // Continue even if removal fails
        }
      }

      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        alert('Failed to upload avatar. Please try again.')
        return
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update the avatar URL in state
      setAvatar(publicUrl)

      // Immediately update the profile with the new avatar URL
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            avatar_url: publicUrl,
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Error updating profile with new avatar:', profileError)
        }
      }

    } catch (error) {
      console.error('Error:', error)
      alert('Failed to upload avatar. Please try again.')
    }
  }

  const saveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          avatar_url: avatar,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return
      }

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email
        })

        if (emailError) {
          console.error('Error updating email:', emailError)
          return
        }
      }

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEF7F3] p-4">
        <div className="max-w-[395px] mx-auto">
          <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4">
            <div className="text-center py-8 text-gray-500">
              Loading...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FEF7F3] p-4">
      <div className="max-w-[395px] mx-auto">
        <div className="bg-[#FCFCFC] rounded-lg border-2 border-[#FCFBFB] p-4">
          <h1 className="text-[#1E0C02] text-[23px] font-bold mb-6">Profile Settings</h1>
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-[#EAEBEB] rounded-full flex items-center justify-center">
                  <User size={40} className="text-[#5F6666]" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-2 bg-[#F2600C] rounded-full cursor-pointer hover:bg-[#E05A0C] transition-colors">
                <Upload size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[#1E0C02] text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <label className="block text-[#1E0C02] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#EAEBEB] rounded px-4 py-2 text-[#5F6666] text-sm"
                placeholder="Enter your email"
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={isSaving}
              className="w-full bg-[#F2600C] text-white py-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}