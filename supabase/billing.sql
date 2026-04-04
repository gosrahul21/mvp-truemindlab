-- 0. Migration: Add country column to organizations if it doesn't exist
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS country TEXT;


CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set default active payment gateway
INSERT INTO public.system_settings (key, value, description)
VALUES ('active_payment_gateway', 'stripe', 'The currently active payment processor (stripe or razorpay)')
ON CONFLICT (key) DO NOTHING;

-- 3. Update Plans table with gateway-specific IDs
ALTER TABLE public.plans 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT;

-- 4. Update Subscriptions table with gateway tracking
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS gateway_customer_id TEXT,
ADD COLUMN IF NOT EXISTS gateway_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS payment_gateway TEXT DEFAULT 'stripe'; -- 'stripe' or 'razorpay'

-- 5. Seed Initial Plans (based on UI)
-- Starter Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Starter', 
  'us', 
  'usd', 
  197, 
  1000, 
  200, 
  0, 
  1000, 
  '["1,000 SMS", "200 voice mins", "Basic Lead Tracking", "Email Support"]'::jsonb
) ON CONFLICT DO NOTHING;

-- Pro Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Pro', 
  'us', 
  'usd', 
  597, 
  6000, 
  1000, 
  0, 
  5000, 
  '["6,000 SMS", "1,000 voice mins", "Advanced AI Agents", "Priority Support"]'::jsonb
) ON CONFLICT DO NOTHING;

-- Agency Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Agency', 
  'us', 
  'usd', 
  997, 
  12000, 
  2500, 
  1000, 
  10000, 
  '["12,000 SMS", "2,500 voice mins", "Unlimited Agents", "Dedicated Manager"]'::jsonb
) ON CONFLICT DO NOTHING;

-- 6. Trigger for system_settings updated_at
CREATE TRIGGER IF NOT EXISTS handle_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 7. Seed India Plans
-- Starter India Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Starter',
  'india',
  'inr',
  14999,
  1000,
  200,
  0,
  1000,
  '["1,000 SMS", "200 voice mins", "Basic Lead Tracking", "Email Support"]'::jsonb
) ON CONFLICT DO NOTHING;

-- Pro India Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Pro',
  'india',
  'inr',
  49999,
  6000,
  1000,
  0,
  5000,
  '["6,000 SMS", "1,000 voice mins", "Advanced AI Agents", "Priority Support"]'::jsonb
) ON CONFLICT DO NOTHING;

-- Agency India Plan
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Agency',
  'india',
  'inr',
  84999,
  12000,
  2500,
  1000,
  10000,
  '["12,000 SMS", "2,500 voice mins", "Unlimited Agents", "Dedicated Manager"]'::jsonb
) ON CONFLICT DO NOTHING;
