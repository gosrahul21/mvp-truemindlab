-- 1. Create Enums Safely
DO $$ BEGIN
    CREATE TYPE member_role AS ENUM ('platform_admin', 'org_owner', 'org_admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE onboarding_status AS ENUM ('not_started', 'in_progress', 'generating', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_region AS ENUM ('india', 'us');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_duration AS ENUM ('14_day', 'month', 'year');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'past_due', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Tables

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  "imageUrl" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS organizations (
  id uuid default gen_random_uuid() primary key,
  name text,
  website_url text,
  primary_offer text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS organization_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users on delete cascade,
  organization_id uuid not null references organizations on delete cascade,
  role member_role not null default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, organization_id)
);

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  org_id uuid primary key references organizations on delete cascade,
  current_step integer default 1 not null,
  status onboarding_status default 'not_started' not null,
  data jsonb default '{}'::jsonb not null,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS plans (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  region plan_region not null default 'us',
  currency text not null default 'usd',
  price_monthly numeric not null default 0,
  duration plan_duration not null default 'month',
  sms_limit integer not null default 0,
  voice_min_limit integer not null default 0,
  whatsapp_limit integer not null default 0,
  contacts_limit integer not null default 0,
  "keyFeatures" jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references organizations on delete cascade,
  plan_id uuid not null references plans on delete restrict,
  status subscription_status not null default 'active',
  current_period_start timestamp with time zone not null default timezone('utc'::text, now()),
  current_period_end timestamp with time zone not null default timezone('utc'::text, now()) + interval '1 month',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- -- Helper function to break RLS infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_org_roles()
RETURNS TABLE (org_id uuid, role member_role)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT organization_id, organization_members.role FROM organization_members WHERE user_id = auth.uid();
END;
$$;

-- User Profiles
DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations
DROP POLICY IF EXISTS "Organization members can read their org" ON organizations;
CREATE POLICY "Organization members can read their org" ON organizations FOR SELECT 
USING (id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Authenticated users can create orgs" ON organizations;
CREATE POLICY "Authenticated users can create orgs" ON organizations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Org owners and admins can update their org" ON organizations;
CREATE POLICY "Org owners and admins can update their org" ON organizations FOR UPDATE 
USING (id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

-- Organization Members
DROP POLICY IF EXISTS "Users can read members in their orgs" ON organization_members;
CREATE POLICY "Users can read members in their orgs" ON organization_members FOR SELECT 
USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Users can add themselves as first org owner" ON organization_members;
CREATE POLICY "Users can add themselves as first org owner" ON organization_members FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id AND role = 'org_owner') OR
  organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin'))
);

DROP POLICY IF EXISTS "Org owners and admins can manage members" ON organization_members;
DROP POLICY IF EXISTS "Org owners and admins can update members" ON organization_members;
CREATE POLICY "Org owners and admins can update members" ON organization_members FOR UPDATE 
USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

DROP POLICY IF EXISTS "Org owners and admins can delete members" ON organization_members;
CREATE POLICY "Org owners and admins can delete members" ON organization_members FOR DELETE 
USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

-- Onboarding Profiles
DROP POLICY IF EXISTS "Members can read their org onboarding" ON onboarding_profiles;
CREATE POLICY "Members can read their org onboarding" ON onboarding_profiles FOR SELECT 
USING (org_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org owners and admins can manage onboarding" ON onboarding_profiles;
CREATE POLICY "Org owners and admins can manage onboarding" ON onboarding_profiles FOR ALL 
USING (org_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

DROP POLICY IF EXISTS "Authenticated users can create onboarding" ON onboarding_profiles;
CREATE POLICY "Authenticated users can create onboarding" ON onboarding_profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Plans
DROP POLICY IF EXISTS "Anyone can read plans" ON plans;
CREATE POLICY "Anyone can read plans" ON plans FOR SELECT USING (true);
-- (Only service role or superadmin can insert/update plans)

-- Subscriptions
DROP POLICY IF EXISTS "Members can read their org subscriptions" ON subscriptions;
CREATE POLICY "Members can read their org subscriptions" ON subscriptions FOR SELECT 
USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles()));

DROP POLICY IF EXISTS "Org owners admins can manage subscriptions" ON subscriptions;
CREATE POLICY "Org owners admins can manage subscriptions" ON subscriptions FOR ALL 
USING (organization_id IN (SELECT org_id FROM public.get_user_org_roles() WHERE role IN ('org_owner', 'org_admin')));

-- 5. Triggers for automagic updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER handle_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_organizations_updated_at ON organizations;
CREATE TRIGGER handle_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_organization_members_updated_at ON organization_members;
CREATE TRIGGER handle_organization_members_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_onboarding_profiles_updated_at ON onboarding_profiles;
CREATE TRIGGER handle_onboarding_profiles_updated_at BEFORE UPDATE ON onboarding_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_plans_updated_at ON plans;
CREATE TRIGGER handle_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER handle_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 6. Atomic Organization Creation RPC
CREATE OR REPLACE FUNCTION create_organization_atomic(
  org_id uuid,
  new_name text,
  new_website_url text,
  new_primary_offer text,
  new_location text,
  owner_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the organization
  INSERT INTO organizations (id, name, website_url, primary_offer, location)
  VALUES (
    org_id, 
    new_name, 
    new_website_url, 
    new_primary_offer, 
    new_location
  );

  -- Insert the member
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (
    org_id, 
    owner_id, 
    'org_owner'
  );
END;
$$;
