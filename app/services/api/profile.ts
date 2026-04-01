import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/supabase/types'

export async function getProfileApi(): Promise<{
  user: any | null
  profile: UserProfile | null
  error: Error | null
}> {
  const supabase = createClient()
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { user: null, profile: null, error: authError || new Error('No user found') }
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile data:', profileError)
      return { user, profile: null, error: profileError }
    }

    return { user, profile, error: null }
  } catch (err: any) {
    console.error('Profile service error:', err)
    return { user: null, profile: null, error: err }
  }
}
