import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/billing/stripe'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret'
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  const supabase = await createSupabaseRouteHandlerClient()

  // Handle successful payments and subscription lifecycle
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const session = event.data.object as any
      const orgId = session.metadata?.organization_id
      const subscriptionId = session.id
      const customerId = session.customer

      if (orgId) {
        // Update DB
        const { error } = await (supabase.from('subscriptions') as any)
          .upsert({
            organization_id: orgId,
            status: 'active',
            gateway_subscription_id: subscriptionId,
            gateway_customer_id: customerId,
            payment_gateway: 'stripe',
            updated_at: new Date().toISOString()
          }, { onConflict: 'organization_id' })

        if (error) console.error('Error updating subscription after Stripe webhook:', error)
      }
      break
    }
    case 'customer.subscription.deleted': {
      const session = event.data.object as any
      const orgId = session.metadata?.organization_id
      if (orgId) {
        await (supabase.from('subscriptions') as any)
          .update({ status: 'canceled' })
          .eq('organization_id', orgId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
