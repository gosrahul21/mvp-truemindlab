-- ============================================================
-- Prevent duplicate leads by phone number within an organization
-- ============================================================

-- 1. Add unique constraint
-- Note: PostgreSQL allows multiple NULLs in unique constraints, 
-- so leads without phone numbers won't conflict with each other.
ALTER TABLE leads 
ADD CONSTRAINT leads_org_phone_unique 
UNIQUE (organization_id, phone);

-- 2. Optional: If you already have duplicates, this command might fail.
-- You can use this query to find and delete duplicates before applying if needed:
/*
DELETE FROM leads a USING leads b
WHERE a.id < b.id 
AND a.organization_id = b.organization_id 
AND a.phone = b.phone;
*/
