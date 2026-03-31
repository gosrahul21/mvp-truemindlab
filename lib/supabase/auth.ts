import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database, MemberRole } from './types'

/** Auth helpers accept any Supabase client with working `.from()`; DB typings are narrowed at call sites. */
export type TypedSupabaseClient = SupabaseClient<Database, 'public', any>

export type SignUpResult =
  | { needsEmailConfirmation: true; user: User | null }
  | {
      needsEmailConfirmation: false
      user: User
      organization: Database['public']['Tables']['organizations']['Row']
    }

export async function signUp(
  supabase: TypedSupabaseClient,
  {
    email,
    password,
    fullName,
    orgName,
  }: {
    email: string
    password: string
    fullName: string
    orgName: string
  }
): Promise<SignUpResult> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const userId = authData.user?.id
  if (!userId) throw new Error('User ID not found after signup')

  if (!authData.session) {
    return { needsEmailConfirmation: true, user: authData.user }
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({ id: userId, full_name: fullName })
  if (profileError) throw profileError

  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: orgName })
    .select()
    .single()
  if (orgError) throw orgError

  const { error: memberError } = await supabase.from('organization_members').insert({
    user_id: userId,
    organization_id: orgData.id,
    role: 'org_owner',
  })
  if (memberError) throw memberError

  return {
    needsEmailConfirmation: false,
    user: authData.user!,
    organization: orgData,
  }
}

/** For OAuth users or email signups after confirmation: ensure profile + default org exist. */
export async function ensureUserWorkspace(supabase: TypedSupabaseClient, user: User) {
  const userId = user.id
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'User'

  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (!existingProfile) {
    const { error } = await supabase
      .from('user_profiles')
      .insert({ id: userId, full_name: fullName })
    if (error) throw error
  }

  // const { data: membership } = await supabase
  //   .from('organization_members')
  //   .select('id')
  //   .eq('user_id', userId)
  //   .maybeSingle()

  // if (membership) return

  // const orgName = `${fullName}'s workspace`
  // const { data: orgData, error: orgError } = await supabase
  //   .from('organizations')
  //   .insert({ name: orgName })
  //   .select()
  //   .single()
  // if (orgError) throw orgError

  // const { error: memberError } = await supabase.from('organization_members').insert({
  //   user_id: userId,
  //   organization_id: orgData.id,
  //   role: 'org_owner',
  // })
  // if (memberError) throw memberError
}

export async function signIn(
  supabase: TypedSupabaseClient,
  { email, password }: { email: string; password: string }
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  if (data.user) {
    await ensureUserWorkspace(supabase, data.user)
  }
  return data
}

export async function signOut(supabase: TypedSupabaseClient) {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUserOrganizations(supabase: TypedSupabaseClient) {
  const { data: memberships, error } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      role,
      organizations (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return memberships
}

export async function getCurrentOrganizationRole(
  supabase: TypedSupabaseClient,
  organizationId: string
) {
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .single()

  if (error) throw error
  return data.role
}

export async function inviteToOrganization(
  supabase: TypedSupabaseClient,
  {
    email,
    organizationId,
    role,
  }: {
    email: string
    organizationId: string
    role: MemberRole
  }
) {
  const { data: userData, error: userError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single()
  if (userError) throw new Error('User not found')

  const { error: memberError } = await supabase.from('organization_members').insert({
    user_id: userData.id,
    organization_id: organizationId,
    role,
  })
  if (memberError) throw memberError
}
