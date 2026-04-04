-- Update Organization Communication Settings table with Provisioning and BYO logic
ALTER TABLE public.organization_communication 
ADD COLUMN IF NOT EXISTS twilio_use_own_number BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS twilio_provisioning_status TEXT DEFAULT 'none', -- 'none', 'pending', 'provisioned'
ADD COLUMN IF NOT EXISTS twilio_voice_number TEXT;
