-- Add country column to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'us';

-- Seed India-specific plans
INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Starter',
  'india',
  'inr',
  4999,
  1000,
  200,
  0,
  1000,
  '["1,000 SMS", "200 voice mins", "Basic Lead Tracking", "Email Support"]'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Pro',
  'india',
  'inr',
  14999,
  6000,
  1000,
  0,
  5000,
  '["6,000 SMS", "1,000 voice mins", "Advanced AI Agents", "Priority Support"]'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO public.plans (name, region, currency, price_monthly, sms_limit, voice_min_limit, whatsapp_limit, contacts_limit, "keyFeatures")
VALUES (
  'Agency',
  'india',
  'inr',
  24999,
  12000,
  2500,
  1000,
  10000,
  '["12,000 SMS", "2,500 voice mins", "Unlimited Agents", "Dedicated Manager"]'::jsonb
) ON CONFLICT DO NOTHING;
