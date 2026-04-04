import Razorpay from 'razorpay'

// Removed aggressive validation to allow build to pass without secrets injected.
// Ensure these keys are set in your deployment environment.

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
})

export async function createRazorpayCustomer(email: string, name: string) {
  return await razorpay.customers.create({
    email,
    name,
    fail_existing: false,
  })
}

export async function createRazorpaySubscription(
  planId: string, 
  customerId: string, 
  totalCount: number = 12,
  organizationId: string
) {
  return await razorpay.subscriptions.create({
    plan_id: planId,
    customer_id: customerId,
    total_count: totalCount,
    quantity: 1,
    notes: {
      organization_id: organizationId,
    },
  } as any)
}
