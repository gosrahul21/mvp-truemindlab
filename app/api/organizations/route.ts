import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { MemberRole } from '@/lib/supabase/types'

/**
 * create organization for a user
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { businessName, websiteUrl, primaryOffer, location, country } = await request.json()

    if (!businessName || typeof businessName !== 'string') {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    const orgId = crypto.randomUUID()

    // Call atomic RPC to create org and assign ownership safely inside a single db transaction
    const { error: rpcError } = await supabase.rpc('create_organization_atomic', {
      org_id: orgId,
      new_name: businessName,
      new_website_url: websiteUrl || null,
      new_primary_offer: primaryOffer || null,
      new_location: location || null,
      new_country: country || null,
      owner_id: user.id
    } as any)

    if (rpcError) {
      console.error('Error creating organization:', rpcError)
      return NextResponse.json({ error: errMessage(rpcError) }, { status: 500 })
    }
    console.log('organization & members created');
    return NextResponse.json({
      organization: {
        id: orgId,
        name: businessName,
        website_url: websiteUrl || null,
        primary_offer: primaryOffer || null,
        location: location || null,
        country: country || null
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Organization creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function errMessage(error: any) {
  if (error?.message) return error.message
  return 'Failed to create organization'
}
