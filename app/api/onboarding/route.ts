import { NextRequest, NextResponse } from 'next/server'
import { defaultOnboardingData, type OnboardingData, type OnboardingProfile } from '@/lib/onboarding-types'
import { supabaseRest } from '@/lib/supabase-rest'

type OnboardingDbRow = {
  org_id: string
  current_step: number
  status: 'not_started' | 'in_progress' | 'generating' | 'completed'
  data: OnboardingData
  completed_at: string | null
}

function fromDbRow(row: OnboardingDbRow): OnboardingProfile {
  return {
    orgId: row.org_id,
    currentStep: row.current_step,
    status: row.status,
    data: row.data ?? defaultOnboardingData,
    completedAt: row.completed_at,
  }
}

export async function GET(request: NextRequest) {
  const orgId = request.nextUrl.searchParams.get('orgId')
  if (!orgId) {
    return NextResponse.json({ error: 'orgId is required' }, { status: 400 })
  }

  try {
    const rows = await supabaseRest<OnboardingDbRow[]>(
      `onboarding_profiles?select=org_id,current_step,status,data,completed_at&org_id=eq.${orgId}&limit=1`
    )

    if (!rows.length) {
      return NextResponse.json({
        profile: {
          orgId,
          currentStep: 1,
          status: 'not_started',
          data: defaultOnboardingData,
          completedAt: null,
        } satisfies OnboardingProfile,
      })
    }

    return NextResponse.json({ profile: fromDbRow(rows[0]) })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      orgId: string
      currentStep: number
      status: OnboardingProfile['status']
      data: OnboardingData
    }

    if (!body.orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 })
    }

    await supabaseRest(
      'organizations?on_conflict=id',
      {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([
          {
            id: body.orgId,
            name: body.data.businessName || null,
            website_url: body.data.websiteUrl || null,
            primary_offer: body.data.primaryOffer || null,
            location: body.data.businessLocation || null,
          },
        ]),
      }
    )

    const completedAt = body.status === 'completed' ? new Date().toISOString() : null

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
            current_step: body.currentStep,
            status: body.status,
            data: body.data,
            completed_at: completedAt,
            updated_at: new Date().toISOString(),
          },
        ]),
      }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
