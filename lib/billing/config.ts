import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'

export type PaymentGateway = 'stripe' | 'razorpay'

export async function getActivePaymentGateway(): Promise<PaymentGateway> {
  const supabase = await createSupabaseRouteHandlerClient()
  
  const { data, error } = await (supabase.from('system_settings') as any)
    .select('value')
    .eq('key', 'active_payment_gateway')
    .single()

  if (error || !data) {
    console.warn('System settings for gateway not found, defaulting to stripe')
    return 'stripe'
  }

  return (data.value as PaymentGateway) || 'stripe'
}
