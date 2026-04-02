import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First get the user's organization
    const { data: orgMember } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single() as any;

    if (!orgMember) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Now get the voice settings for this organization
    const { data: voiceSettings, error } = await supabase
      .from('voice_settings')
      .select('*')
      .eq('organization_id', orgMember.organization_id)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found', which is fine
      console.error('Error fetching voice settings:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ data: voiceSettings })
  } catch (error: any) {
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
    const { preset_id, prompt, vapi_config, language } = body

    if (!preset_id || !prompt || !vapi_config || !language) {
      return NextResponse.json({ error: 'Mission required fields' }, { status: 400 })
    }

    // Get user's org
    const { data: orgMember } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single() as any;

    if (!orgMember) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Upsert voice settings
    const { data, error } = await (supabase.from('voice_settings') as any)
      .upsert({
        organization_id: orgMember.organization_id,
        preset_id,
        language,
        prompt,
        vapi_config,
        updated_at: new Date().toISOString()
      }, { onConflict: 'organization_id' })
      .select('*')
      .single()

    if (error) {
      console.error('Error saving voice settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
