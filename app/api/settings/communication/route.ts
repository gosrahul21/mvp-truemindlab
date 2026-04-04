import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { encrypt, decrypt } from '@/lib/crypto'

export async function GET(request: NextRequest) {
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

    const { data, error } = await (supabase.from('organization_communication') as any)
      .select('*')
      .eq('organization_id', membership.organization_id)
      .single()

    if (!data) return NextResponse.json({})

    // Decrypt sensitive fields
    return NextResponse.json({
      ...data,
      twilio_auth_token: data.twilio_auth_token ? decrypt(data.twilio_auth_token) : '',
      whatsapp_api_key: data.whatsapp_api_key ? decrypt(data.whatsapp_api_key) : '',
      email_api_key: data.email_api_key ? decrypt(data.email_api_key) : ''
    })

  } catch (error: any) {
    console.error('Error fetching communication settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data: membership } = await (supabase.from('organization_members') as any)
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 })
    }

    // Encrypt sensitive fields
    const payload = {
      ...body,
      organization_id: membership.organization_id,
      twilio_auth_token: body.twilio_auth_token ? encrypt(body.twilio_auth_token) : null,
      whatsapp_api_key: body.whatsapp_api_key ? encrypt(body.whatsapp_api_key) : null,
      email_api_key: body.email_api_key ? encrypt(body.email_api_key) : null,
      twilio_use_own_number: body.twilio_use_own_number ?? true,
      twilio_provisioning_status: body.twilio_provisioning_status ?? 'none',
      updated_at: new Date().toISOString()
    }

    const { data, error } = await (supabase.from('organization_communication') as any)
      .upsert(payload, { onConflict: 'organization_id' })
      .select()

    if (error) throw error

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Error saving communication settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
