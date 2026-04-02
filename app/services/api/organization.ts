import { createClient } from '@/lib/supabase/client'
import type { Organization, OrganizationMember } from '@/lib/supabase/types'

export async function createOrganizationApi(name: string): Promise<{
  organization: Organization | null
  member: OrganizationMember | null
  error: Error | null
}> {
  const supabase = createClient()
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { organization: null, member: null, error: authError || new Error('No authenticated user found') }
    }

    // 1. Create Organization
    const { data: orgData, error: orgError } = await (supabase.from('organizations') as any)
      .insert({ name } as any) // Using any to bypass TS inference if types are misaligned internally
      .select('*')
      .single()

    if (orgError || !orgData) {
      console.error('Error creating organization:', orgError)
      return { organization: null, member: null, error: orgError || new Error('Failed to create organization') }
    }

    // 2. Add current user as 'org_owner' in organization_members link table
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: user.id,
        organization_id: orgData.id,
        role: 'org_owner'
      } as any)
      .select('*')
      .single()

    if (memberError || !memberData) {
      console.error('Error assigning organization member:', memberError)
      // Note: In production, moving this to a Supabase RPC function helps ensure atomic transactions
      return { organization: orgData, member: null, error: memberError || new Error('Failed to assign member link') }
    }

    return { organization: orgData, member: memberData, error: null }
  } catch (err: any) {
    console.error('Organization creation service error:', err)
    return { organization: null, member: null, error: err }
  }
}
