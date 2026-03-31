-- Create user_profiles table
create table user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create organizations table
create table organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create member_role enum
create type member_role as enum ('platform_admin', 'org_owner', 'org_admin', 'staff');

-- Create organization_members table
create table organization_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  organization_id uuid references organizations not null,
  role member_role not null default 'staff',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, organization_id)
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
alter table user_profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;

-- User Profiles policies
create policy "Users can read their own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Organizations policies
create policy "Organization members can read their organizations"
  on organizations for select
  using (
    exists (
      select 1
      from organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
    )
  );

create policy "Org owners and admins can update their organization"
  on organizations for update
  using (
    exists (
      select 1
      from organization_members
      where organization_id = organizations.id
      and user_id = auth.uid()
      and role in ('org_owner', 'org_admin')
    )
  );

-- Organization Members policies
create policy "Users can read members in their organizations"
  on organization_members for select
  using (
    exists (
      select 1
      from organization_members my_membership
      where my_membership.organization_id = organization_members.organization_id
      and my_membership.user_id = auth.uid()
    )
  );

create policy "Org owners and admins can manage members"
  on organization_members for all
  using (
    exists (
      select 1
      from organization_members my_membership
      where my_membership.organization_id = organization_members.organization_id
      and my_membership.user_id = auth.uid()
      and my_membership.role in ('org_owner', 'org_admin')
    )
  );

-- Signup / OAuth: inserts when authenticated
create policy "Users can insert their own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Authenticated users can create organizations"
  on organizations for insert
  with check (auth.role() = 'authenticated');

create policy "Users can add themselves as first org owner"
  on organization_members for insert
  with check (
    auth.uid() = user_id
    and role = 'org_owner'
    and not exists (
      select 1 from organization_members existing
      where existing.organization_id = organization_members.organization_id
    )
  );

-- Create trigger function for updating timestamps
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_user_profiles_updated_at
  before update on user_profiles
  for each row
  execute function handle_updated_at();

create trigger handle_organizations_updated_at
  before update on organizations
  for each row
  execute function handle_updated_at();

create trigger handle_organization_members_updated_at
  before update on organization_members
  for each row
  execute function handle_updated_at();