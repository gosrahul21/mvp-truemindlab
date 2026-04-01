import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, orgId } = await request.json()

    if (!planId || !orgId) {
      return NextResponse.json({ error: 'Plan ID and Organization ID are required' }, { status: 400 })
    }

    // Insert Subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: orgId,
        plan_id: planId,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Subscription creation error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create subscription' }, { status: 500 })
    }

    return NextResponse.json({ subscription: data }, { status: 201 })
  } catch (error: any) {
    console.error('Subscription creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
