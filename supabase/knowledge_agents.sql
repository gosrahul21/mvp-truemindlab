-- 1. Add industry to organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS industry TEXT;

-- 2. Create agent templates table
CREATE TABLE IF NOT EXISTS public.agent_master_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'voice', 'whatsapp'
  use_case TEXT NOT NULL, -- 'inbound_support', 'outbound_missed_inquiry', 'outbound_service_feedback'
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed some generic master templates
INSERT INTO public.agent_master_templates (industry, channel, use_case, prompt_template) VALUES
('real_estate', 'voice', 'inbound_support', 'You are the receptionist for {{business_name}}. Answer questions using this info: {{faqs}}. To view a home, inform them you will securely text them this link: {{booking_url}}'),
('real_estate', 'whatsapp', 'inbound_support', 'You are the assistant for {{business_name}}. Use emojis. If they want to book a viewing, send: {{booking_url}}'),
('medspa', 'voice', 'inbound_support', 'You are the friendly receptionist for {{business_name}}. Keep your answers concisely under 2 sentences. Use this info: {{faqs}}. If they want to book, offer this link: {{booking_url}}'),
('medspa', 'voice', 'outbound_missed_inquiry', 'You are calling from {{business_name}}. Wait for them to say hello. Your goal is to see if they still need help or want to book. Use link: {{booking_url}}'),
('doctor', 'voice', 'inbound_support', 'You are the receptionist for {{business_name}} medical clinic. Answer questions strictly using this info: {{faqs}}. Do not offer medical advice. Link to book: {{booking_url}}'),
('doctor', 'voice', 'outbound_service_feedback', 'You are calling on behalf of {{business_name}}. Ask the patient how their recent visit was. Be extremely empathetic.'),
('general', 'voice', 'inbound_support', 'You are the receptionist for {{business_name}}. Use this info intelligently: {{faqs}}. Link: {{booking_url}}'),
('general', 'whatsapp', 'inbound_support', 'You are the digital assistant for {{business_name}}. Answer concisely using this info: {{faqs}}. Link: {{booking_url}}');

-- 3. Create Knowledge Base table
CREATE TABLE IF NOT EXISTS public.organization_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  booking_url TEXT,
  booking_provider TEXT, -- 'google_calendar', 'calendly', 'zoho', 'teams'
  faqs TEXT,
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id)
);

-- 4. Create Organization Agents table (replaces older voice_settings singleton)
CREATE TABLE IF NOT EXISTS public.organization_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  agent_type TEXT NOT NULL, -- 'inbound', 'outbound'
  channel TEXT NOT NULL, -- 'voice', 'whatsapp', 'email'
  use_case TEXT, -- 'inbound_support', 'outbound_missed_inquiry', 'outbound_service_feedback'
  system_prompt TEXT,
  provider_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
