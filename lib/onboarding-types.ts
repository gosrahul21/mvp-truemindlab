import type { VoicePreset } from '@/lib/voicePresets'

export type OnboardingStatus = 'not_started' | 'in_progress' | 'generating' | 'completed'

export type BookingMethod = 'external_link' | 'internal_placeholder'
export type ToneStyle = 'professional' | 'friendly' | 'conversational' | 'premium'
export type VoicePresetSelection = VoicePreset['id']

export type CommunicationSetup = {
  smsEnabled: boolean
  emailEnabled: boolean
  voiceEnabled: boolean
  businessHoursOnly: boolean
}

export type EmailSetup = {
  provider: 'platform_smtp' | 'custom_smtp'
  fromName: string
  fromEmail: string
  replyToEmail: string
}

export type OnboardingData = {
  businessName: string
  websiteUrl: string
  primaryOffer: string
  businessLocation: string
  toneStyle: ToneStyle
  bookingMethod: BookingMethod
  bookingLink: string
  voicePreset: VoicePresetSelection
  communication: CommunicationSetup
  email: EmailSetup
}

export type OnboardingProfile = {
  orgId: string
  currentStep: number
  status: OnboardingStatus
  data: OnboardingData
  completedAt?: string | null
}

export const TOTAL_ONBOARDING_STEPS = 10

export const defaultOnboardingData: OnboardingData = {
  businessName: '',
  websiteUrl: '',
  primaryOffer: '',
  businessLocation: '',
  toneStyle: 'professional',
  bookingMethod: 'external_link',
  bookingLink: '',
  voicePreset: 'voice-neutral-female-1',
  communication: {
    smsEnabled: true,
    emailEnabled: true,
    voiceEnabled: true,
    businessHoursOnly: true,
  },
  email: {
    provider: 'platform_smtp',
    fromName: '',
    fromEmail: '',
    replyToEmail: '',
  },
}
