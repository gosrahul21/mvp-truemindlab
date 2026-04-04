import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature') as string

  // Simple signature verification
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_secret')
    .update(body)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.error('Invalid Razorpay signature')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const supabase = await createSupabaseRouteHandlerClient()

  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged': {
      const subscription = event.payload.subscription.entity
      const orgId = subscription.notes?.organization_id
      const subscriptionId = subscription.id
      const customerId = subscription.customer_id

      if (orgId) {
        const { error } = await (supabase.from('subscriptions') as any)
          .upsert({
            organization_id: orgId,
            status: 'active',
            gateway_subscription_id: subscriptionId,
            gateway_customer_id: customerId,
            payment_gateway: 'razorpay',
            updated_at: new Date().toISOString()
          }, { onConflict: 'organization_id' })

        if (error) console.error('Error updating subscription after Razorpay webhook:', error)
      }
      break
    }
    case 'subscription.cancelled': {
      const subscription = event.payload.subscription.entity
      const orgId = subscription.notes?.organization_id
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
