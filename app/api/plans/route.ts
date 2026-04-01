import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { determineUserRegion } from '@/lib/regionService'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for')
    let ip = ''
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim()
    } else {
      ip = req.headers.get('x-real-ip') || ''
    }

    const userRegion = await determineUserRegion(ip || null)

    const supabase = await createSupabaseRouteHandlerClient()
    const { data: plans, error } = await supabase.from('plans').select('*').order('price_monthly', { ascending: true })

    if (error) throw error
    
    // Filter plans by detected region, fallback to all if none exist for that region
    const regionalPlans = (plans as any[])?.filter((p: any) => p.region === userRegion) || []
    const displayPlans = regionalPlans.length > 0 ? regionalPlans : plans

    return NextResponse.json({ plans: displayPlans })
  } catch (error: any) {
    console.error('Fetch plans error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch plans' }, { status: 500 })
  }
}
