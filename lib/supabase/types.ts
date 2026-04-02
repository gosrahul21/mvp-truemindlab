export enum MemberRole {
  PLATFORM_ADMIN = 'platform_admin',
  ORG_OWNER = 'org_owner',
  ORG_ADMIN = 'org_admin',
  STAFF = 'staff',
}

export type PlanRegion = 'india' | 'us'
export type PlanDuration = '14_day' | 'month' | 'year'
export type SubscriptionStatus = 'active' | 'expired' | 'past_due' | 'canceled'

export interface UserProfile {
  id: string
  full_name: string
  imageUrl?: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  website_url?: string | null
  primary_offer?: string | null
  location?: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  user_id: string
  organization_id: string
  role: MemberRole
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  region: PlanRegion
  currency: string
  price_monthly: number
  duration: PlanDuration
  sms_limit: number
  voice_min_limit: number
  whatsapp_limit: number
  contacts_limit: number
  keyFeatures: string[]
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  organization_id: string
  plan_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export interface VoiceSettings {
  id: string
  organization_id: string
  preset_id: string
  language?: string | null
  prompt?: string | null
  vapi_config?: any | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'created_at' | 'updated_at'>>
        Relationships: []
      }
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      organization_members: {
        Row: OrganizationMember
        Insert: Omit<OrganizationMember, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<OrganizationMember, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      plans: {
        Row: Plan
        Insert: Omit<Plan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      voice_settings: {
        Row: VoiceSettings
        Insert: Omit<VoiceSettings, 'id' | 'created_at' | 'updated_at'> & { language?: string | null }
        Update: Partial<Omit<VoiceSettings, 'id' | 'created_at' | 'updated_at'>> & { language?: string | null }
        Relationships: [
          {
            foreignKeyName: "voice_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_atomic: {
        Args: {
          org_id: string
          new_name: string
          new_website_url: string | null
          new_primary_offer: string | null
          new_location: string | null
          owner_id: string
        }
        Returns: void
      }
    }
  }
}