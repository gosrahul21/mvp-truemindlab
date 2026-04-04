import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: membership } = await (supabase.from('organization_members') as any)
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 })
    }

    // SIMULATION: Update status and "allocate" a number
    // In production, this would hit the Twilio API with our system credentials
    const provisionedNumber = `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`

    const { error } = await (supabase.from('organization_communication') as any)
      .upsert({
        organization_id: membership.organization_id,
        twilio_use_own_number: false,
        twilio_provisioning_status: 'provisioned',
        twilio_phone_number: provisionedNumber,
        updated_at: new Date().toISOString()
      }, { onConflict: 'organization_id' })

    if (error) throw error

    return NextResponse.json({ 
      ok: true, 
      number: provisionedNumber,
      message: 'New AI phone number provisioned and assigned to your organization.'
    })

  } catch (error: any) {
    console.error('Provisioning error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
