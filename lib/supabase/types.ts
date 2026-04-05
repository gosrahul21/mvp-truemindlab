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
  industry?: string | null
  primary_offer?: string | null
  location?: string | null
  country?: string | null
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
  stripe_price_id?: string | null
  razorpay_plan_id?: string | null
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
  gateway_customer_id?: string | null
  gateway_subscription_id?: string | null
  payment_gateway?: 'stripe' | 'razorpay' | null
  created_at: string
  updated_at: string
}

export interface SystemSetting {
  key: string
  value: string
  description?: string | null
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

export interface OrganizationKnowledge {
  id: string
  organization_id: string
  booking_url?: string | null
  booking_provider?: 'google_calendar' | 'calendly' | 'zoho' | 'teams' | null
  faqs?: string | null
  target_audience?: string | null
  created_at: string
  updated_at: string
}

export interface AgentMasterTemplate {
  id: string
  industry: string
  channel: 'voice' | 'whatsapp' | 'email'
  use_case: string
  prompt_template: string
  created_at: string
}

export interface OrganizationAgent {
  id: string
  organization_id: string
  name: string
  agent_type: 'inbound' | 'outbound'
  channel: 'voice' | 'whatsapp' | 'email'
  use_case?: string | null
  language?: string | null
  system_prompt?: string | null
  provider_config?: any | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrganizationCommunication {
  id: string
  organization_id: string
  twilio_account_sid?: string | null
  twilio_auth_token?: string | null
  twilio_phone_number?: string | null
  twilio_voice_number?: string | null
  twilio_use_own_number: boolean
  twilio_provisioning_status?: 'none' | 'pending' | 'provisioned' | null
  whatsapp_provider?: 'twilio' | 'meta' | null
  whatsapp_api_key?: string | null
  whatsapp_phone_number?: string | null
  email_provider?: 'sendgrid' | 'postmark' | 'ses' | 'smtp' | null
  email_api_key?: string | null
  email_from_address?: string | null
  email_from_name?: string | null
  created_at: string
  updated_at: string
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'lost'
export type LeadChannel = 'whatsapp' | 'sms' | 'voice' | 'email' | 'website' | 'facebook' | 'instagram' | 'referral' | 'other'
export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'no_show' | 'cancelled'

export interface Lead {
  id: string
  organization_id: string
  created_by?: string | null
  name: string
  phone?: string | null
  email?: string | null
  source: LeadChannel
  reason?: string | null
  notes?: string | null
  status: LeadStatus
  follow_up_enrolled: boolean
  follow_up_sent_at?: string | null
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  organization_id: string
  lead_id?: string | null
  created_by?: string | null
  patient_name: string
  patient_phone?: string | null
  doctor?: string | null
  channel: LeadChannel
  scheduled_at: string
  status: AppointmentStatus
  confirmation_sent: boolean
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  organization_id: string
  lead_id?: string | null
  patient_name: string
  rating: number
  comment?: string | null
  channel?: string | null
  replied: boolean
  replied_at?: string | null
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
      agent_master_templates: {
        Row: AgentMasterTemplate
        Insert: Omit<AgentMasterTemplate, 'id' | 'created_at'>
        Update: Partial<Omit<AgentMasterTemplate, 'id' | 'created_at'>>
        Relationships: []
      }
      organization_knowledge: {
        Row: OrganizationKnowledge
        Insert: Omit<OrganizationKnowledge, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<OrganizationKnowledge, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "organization_knowledge_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_agents: {
        Row: OrganizationAgent
        Insert: Omit<OrganizationAgent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<OrganizationAgent, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "organization_agents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_communication: {
        Row: OrganizationCommunication
        Insert: Omit<OrganizationCommunication, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<OrganizationCommunication, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "organization_communication_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>
        Relationships: [
          {
            foreignKeyName: "reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
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
          new_country: string | null
          owner_id: string
        }
        Returns: void
      }
    }
  }
}