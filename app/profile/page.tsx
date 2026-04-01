'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/supabase/types'
import { getProfileApi } from '@/app/services/api/profile'
import Image from 'next/image'

export default function ProfilePage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Fetch Session User and Profile
  useEffect(() => {
    async function loadData() {
      try {
        const { user, profile: userProfile } = await getProfileApi()
        if (user) {
          setUserEmail(user.email || 'unknown')
        }
        if (userProfile) {
          setProfile(userProfile)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    setSaving(true)
    try {
      const { error } = await (supabase.from('user_profiles') as any)
        .update({ full_name: profile.full_name })
        .eq('id', profile.id)
        
      if (error) throw error
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !profile) {
        return
      }
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      setUploading(true)
      console.log(await supabase.auth.getUser()
)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
        console.log(data.publicUrl)

      if (data.publicUrl) {
        const { error: updateError } = await (supabase.from('user_profiles') as any)
          .update({ imageUrl: data.publicUrl })
          .eq('id', profile.id)

        if (updateError) throw updateError

        setProfile({ ...profile, imageUrl: data.publicUrl })
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <section className="flex items-center justify-center p-10 h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </section>
    )
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your personal information and avatar</p>
      </header>

      <form onSubmit={handleSave} className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="relative h-20 w-20 overflow-hidden flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-2xl font-semibold dark:bg-gray-700 dark:text-gray-200">
            {profile?.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <Image width={80} height={80} src={profile.imageUrl} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              null
              // (profile?.full_name?.substring(0,2).toUpperCase()) || '?'
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden" 
              disabled={uploading}
            />
            <button 
              type="button" 
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
            >
              {uploading ? 'Uploading...' : 'Change Avatar'}
            </button>
            <p className="mt-2 text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="space-y-5 max-w-xl">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</span>
            <input
              type="text"
              value={profile?.full_name || ''}
              onChange={(e) => setProfile(profile ? { ...profile, full_name: e.target.value } : null)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</span>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-500"
            />
            <span className="mt-1 block text-xs text-gray-500">Email cannot be changed directly. Contact support.</span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
            <input
              type="text"
              value="Owner" /* In a real app this is derived from org memberships */
              disabled
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none cursor-not-allowed dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-400"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={saving || loading || !profile} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}
