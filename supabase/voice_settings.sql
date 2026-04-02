-- Run this in your Supabase SQL Editor

CREATE TABLE public.voice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  preset_id TEXT NOT NULL,
  language TEXT DEFAULT 'en-US',
  prompt TEXT,
  vapi_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(organization_id)
);

-- Turn on Row Level Security
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow members of the organization to view the voice settings
CREATE POLICY "Enable read access for all members" ON public.voice_settings
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members
            WHERE user_id = auth.uid()
        )
    );

-- Policy to allow owner or admin to update/insert the voice settings
CREATE POLICY "Enable write access for admins" ON public.voice_settings
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.organization_members
            WHERE user_id = auth.uid() AND role IN ('org_owner', 'org_admin')
        )
    );
