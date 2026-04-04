import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { getActivePaymentGateway } from '@/lib/billing/config'
import { stripe, createStripeCheckout, createStripeCustomer } from '@/lib/billing/stripe'
import { razorpay, createRazorpaySubscription, createRazorpayCustomer } from '@/lib/billing/razorpay'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, region } = await request.json()
    const activeGateway = await getActivePaymentGateway()

    // 1. Get Organization
    const { data: membership } = await (supabase.from('organization_members') as any)
      .select('organization_id, organizations(name)')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 })
    }

    const orgId = membership.organization_id
    const orgName = membership.organizations?.name || 'My Organization'

    // 2. Get Plan
    const { data: plan, error: planError } = await (supabase.from('plans') as any)
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // 3. Handle Gateway Specific Checkout
    if (activeGateway === 'stripe') {
      const priceId = plan.stripe_price_id
      if (!priceId) return NextResponse.json({ error: 'Stripe Price ID not configured for this plan' }, { status: 400 })

      // Create or get customer (in realistic app, check if sync'd in user_profiles)
      const customer = await createStripeCustomer(user.email!, orgName)
      
      const session = await createStripeCheckout(
        customer.id,
        priceId,
        `${request.nextUrl.origin}/billing?success=true`,
        `${request.nextUrl.origin}/billing?canceled=true`,
        orgId
      )

      return NextResponse.json({ url: session.url, gateway: 'stripe' })
    } 
    
    if (activeGateway === 'razorpay') {
      const rplanId = plan.razorpay_plan_id
      if (!rplanId) return NextResponse.json({ error: 'Razorpay Plan ID not configured for this plan' }, { status: 400 })

      const customer = await createRazorpayCustomer(user.email!, orgName)

      const subscription = await createRazorpaySubscription(
        rplanId,
        customer.id,
        12, // 1 year of months
        orgId
      )

      return NextResponse.json({ 
        subscriptionId: (subscription as any).id, 
        gateway: 'razorpay',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: plan.price_monthly * 100, // in paise
        currency: plan.currency.toUpperCase(),
        name: 'Follow AI',
        description: `Subscription: ${plan.name}`,
        prefill: {
          name: orgName,
          email: user.email,
        }
      })
    }

    throw new Error('Unsupported gateway')

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
