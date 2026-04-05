-- ============================================================
-- Reviews & Feedback Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  lead_id         uuid REFERENCES leads ON DELETE SET NULL,
  
  patient_name    text NOT NULL,
  rating          integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment         text,
  channel         text DEFAULT 'whatsapp',
  
  replied         boolean DEFAULT false,
  replied_at      timestamp with time zone,
  
  created_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at      timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS reviews_org_idx ON reviews (organization_id);
CREATE INDEX IF NOT EXISTS reviews_created_idx ON reviews (organization_id, created_at DESC);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members can read reviews" ON reviews;
CREATE POLICY "Org members can read reviews" ON reviews FOR SELECT
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can insert reviews" ON reviews;
CREATE POLICY "Org members can insert reviews" ON reviews FOR INSERT
  WITH CHECK (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org members can update reviews" ON reviews;
CREATE POLICY "Org members can update reviews" ON reviews FOR UPDATE
  USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

-- Trigger
DROP TRIGGER IF EXISTS handle_reviews_updated_at ON reviews;
CREATE TRIGGER handle_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
