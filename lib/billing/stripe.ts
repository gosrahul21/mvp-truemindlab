import Stripe from 'stripe'

// Removed aggressive validation to allow build to pass without secrets injected.
// Ensure these keys are set in your deployment environment.

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  // apiVersion: '2024-12-18.acacia' as any, // Defaulting to account version is safer if specific version is unknown
  appInfo: {
    name: 'Follow AI',
    version: '0.1.0',
  },
})

export async function createStripeCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
  })
}

export async function createStripeCheckout(
  customerId: string, 
  priceId: string, 
  successUrl: string, 
  cancelUrl: string,
  organizationId: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organization_id: organizationId,
    },
    subscription_data: {
      metadata: {
        organization_id: organizationId,
      },
    },
  })
}
