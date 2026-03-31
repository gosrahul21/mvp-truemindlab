import { NextRequest, NextResponse } from 'next/server'
import { supabaseRest } from '@/lib/supabase-rest'
import type { OnboardingData } from '@/lib/onboarding-types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      orgId: string
      data: OnboardingData
    }

    if (!body.orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 })
    }

    // Placeholder generation payload for downstream AI systems.
    const generatedAssets = {
      businessSummary: `${body.data.businessName} in ${body.data.businessLocation} offering ${body.data.primaryOffer}`,
      toneStyle: body.data.toneStyle,
      voicePrompt: `Use ${body.data.voicePreset} tone and focus on booking appointments.`,
      bookingCta: body.data.bookingLink || 'Contact us to book your appointment',
      generatedAt: new Date().toISOString(),
    }

    await supabaseRest(
      'onboarding_profiles?on_conflict=org_id',
      {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([
          {
            org_id: body.orgId,
            status: 'completed',
            current_step: 10,
            generated_assets: generatedAssets,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]),
      }
    )

    return NextResponse.json({ ok: true, generatedAssets })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
