import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { signOut } from '@/lib/supabase/auth'

export async function POST() {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    await signOut(supabase)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
