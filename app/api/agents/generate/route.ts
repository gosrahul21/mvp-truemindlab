import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { findTemplate, compilePrompt } from '@/lib/templates'
import { OrganizationAgent } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = await request.json()
    if (!orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 })
    }

    // 1. Fetch organization details
    const { data: org } = await (supabase.from('organizations') as any)
      .select('name, industry, location, website_url')
      .eq('id', orgId)
      .single()

    if (!org) throw new Error('Organization not found')

    // 2. Fetch knowledge base
    const { data: knowledge } = await (supabase.from('organization_knowledge') as any)
      .select('booking_url, faqs, target_audience')
      .eq('organization_id', orgId)
      .maybeSingle()

    const facts = {
      businessName: org.name || 'Your Business',
      bookingUrl: knowledge?.booking_url || '',
      faqs: knowledge?.faqs || '',
      targetAudience: knowledge?.target_audience || 'customers',
      industry: org.industry || 'general',
      location: org.location || 'Online'
    }

    // 3. Define the suite of agents we want to auto-generate
    const agentBlueprints = [
      { 
        name: 'Inbound Receptionist', 
        type: 'inbound', 
        channel: 'voice', 
        useCase: 'inbound_support' 
      },
      { 
        name: 'WhatsApp Assistant', 
        type: 'inbound', 
        channel: 'whatsapp', 
        useCase: 'inbound_support' 
      },
      { 
        name: 'Missed Call Follow-up', 
        type: 'outbound', 
        channel: 'voice', 
        useCase: 'outbound_missed_inquiry' 
      },
      { 
        name: 'Post-Service Feedback', 
        type: 'outbound', 
        channel: 'voice', 
        useCase: 'outbound_service_feedback' 
      }
    ]

    const generatedAgents = []

    for (const blueprint of agentBlueprints) {
      const template = await findTemplate(facts.industry, blueprint.channel, blueprint.useCase)
      
      if (template) {
        const finalPrompt = compilePrompt(template.prompt_template, facts)
        
        generatedAgents.push({
          organization_id: orgId,
          name: blueprint.name,
          agent_type: blueprint.type,
          channel: blueprint.channel,
          use_case: blueprint.useCase,
          system_prompt: finalPrompt,
          is_active: true,
          updated_at: new Date().toISOString()
        })
      }
    }

    if (generatedAgents.length > 0) {
      const { error: upsertError } = await (supabase.from('organization_agents') as any)
        .upsert(generatedAgents, { onConflict: 'organization_id,channel,use_case' })
      
      if (upsertError) throw upsertError
    }

    return NextResponse.json({ 
      ok: true, 
      count: generatedAgents.length 
    })

  } catch (error: any) {
    console.error('Agent generation failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
