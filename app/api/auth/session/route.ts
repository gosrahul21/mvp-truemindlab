import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function GET() {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(null)
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: memberships } = await supabase
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      user,
      session,
      organizations: memberships || [],
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
