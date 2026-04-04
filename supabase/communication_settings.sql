-- 1. Create Organization Communication Settings table
CREATE TABLE IF NOT EXISTS public.organization_communication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Twilio
  twilio_account_sid TEXT,
  twilio_auth_token TEXT, -- Encrypted at app level
  twilio_phone_number TEXT,
  
  -- WhatsApp
  whatsapp_provider TEXT DEFAULT 'twilio', -- 'twilio', 'meta'
  whatsapp_api_key TEXT, -- Encrypted
  whatsapp_phone_number TEXT,
  
  -- Email
  email_provider TEXT DEFAULT 'sendgrid', -- 'sendgrid', 'postmark', 'ses', 'smtp'
  email_api_key TEXT, -- Encrypted
  email_from_address TEXT,
  email_from_name TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id)
);

-- 2. Enable RLS
ALTER TABLE public.organization_communication ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Org members can view their own communication settings"
  ON public.organization_communication FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = organization_communication.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Org admins can manage communication settings"
  ON public.organization_communication FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_members.organization_id = organization_communication.organization_id
      AND organization_members.user_id = auth.uid()
      AND (organization_members.role = 'org_owner' OR organization_members.role = 'org_admin')
    )
  );

-- 4. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_communication_updated
  BEFORE UPDATE ON public.organization_communication
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
