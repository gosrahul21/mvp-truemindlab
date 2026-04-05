-- ============================================================
-- Leads & Appointments Schema Migration
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'booked', 'lost');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE lead_channel AS ENUM ('whatsapp', 'sms', 'voice', 'email', 'website', 'facebook', 'instagram', 'referral', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending', 'completed', 'no_show', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  created_by      uuid REFERENCES auth.users ON DELETE SET NULL,

  -- Patient info
  name            text NOT NULL,
  phone           text,
  email           text,

  -- Lead context
  source          lead_channel NOT NULL DEFAULT 'other',
  reason          text,                         -- reason for visit
  notes           text,

  -- Stage
  status          lead_status NOT NULL DEFAULT 'new',

  -- Follow-up
  follow_up_enrolled  boolean NOT NULL DEFAULT false,
  follow_up_sent_at   timestamp with time zone,

  created_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  lead_id         uuid REFERENCES leads ON DELETE SET NULL,
  created_by      uuid REFERENCES auth.users ON DELETE SET NULL,

  -- Patient info (denormalised for quick display if lead not linked)
  patient_name    text NOT NULL,
  patient_phone   text,

  -- Appointment details
  doctor          text,
  channel         lead_channel NOT NULL DEFAULT 'whatsapp',
  scheduled_at    timestamp with time zone NOT NULL,   -- date + time combined
  status          appointment_status NOT NULL DEFAULT 'pending',

  -- Confirmation
  confirmation_sent boolean NOT NULL DEFAULT false,
  notes           text,

  created_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS leads_org_idx         ON leads (organization_id);
CREATE INDEX IF NOT EXISTS leads_status_idx      ON leads (organization_id, status);
CREATE INDEX IF NOT EXISTS leads_created_idx     ON leads (organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS appointments_org_idx  ON appointments (organization_id);
CREATE INDEX IF NOT EXISTS appointments_sched_idx ON appointments (organization_id, scheduled_at);
CREATE INDEX IF NOT EXISTS appointments_lead_idx ON appointments (lead_id);

-- 5. Enable RLS
ALTER TABLE leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies — Leads
DROP POLICY IF EXISTS "Org members can read leads"   ON leads;
CREATE POLICY "Org members can read leads" ON leads FOR SELECT
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can insert leads" ON leads;
CREATE POLICY "Org members can insert leads" ON leads FOR INSERT
  WITH CHECK (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can update leads" ON leads;
CREATE POLICY "Org members can update leads" ON leads FOR UPDATE
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org admins can delete leads" ON leads;
CREATE POLICY "Org admins can delete leads" ON leads FOR DELETE
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

-- 7. RLS Policies — Appointments
DROP POLICY IF EXISTS "Org members can read appointments"   ON appointments;
CREATE POLICY "Org members can read appointments" ON appointments FOR SELECT
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can insert appointments" ON appointments;
CREATE POLICY "Org members can insert appointments" ON appointments FOR INSERT
  WITH CHECK (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can update appointments" ON appointments;
CREATE POLICY "Org members can update appointments" ON appointments FOR UPDATE
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org admins can delete appointments" ON appointments;
CREATE POLICY "Org admins can delete appointments" ON appointments FOR DELETE
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

-- 8. updated_at triggers
DROP TRIGGER IF EXISTS handle_leads_updated_at        ON leads;
CREATE TRIGGER handle_leads_updated_at
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_appointments_updated_at ON appointments;
CREATE TRIGGER handle_appointments_updated_at
  BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
