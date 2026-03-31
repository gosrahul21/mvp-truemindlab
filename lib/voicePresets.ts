/**
 * Voice Preset Model
 * Represents a curated voice configuration for Vapi integration
 */
export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  voiceId: string; // Vapi voice ID
  provider: 'vapi' | 'elevenlabs' | 'aws' | 'azure';
  language: string;
  gender: 'male' | 'female' | 'neutral';
  tone: 'professional' | 'friendly' | 'energetic' | 'calm' | 'authoritative';
  accent?: string;
  previewUrl?: string; // URL to audio preview
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Organization Voice Selection
 * Stores the selected voice preset for an organization
 */
export interface OrganizationVoiceSelection {
  organizationId: string;
  voicePresetId: string;
  selectedAt: Date;
  selectedBy: string; // user ID
  isActive: boolean;
}

/**
 * Voice Call Record Structure
 * Represents a voice call made through Vapi
 */
export interface VoiceCallRecord {
  id: string;
  organizationId: string;
  voicePresetId: string;
  vapiCallId: string; // Vapi's call ID
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  direction: 'outbound' | 'inbound';
  fromNumber: string; // Caller ID
  toNumber: string; // Recipient
  duration?: number; // in seconds
  startedAt?: Date;
  endedAt?: Date;
  cost?: number; // in USD
  transcript?: string;
  summary?: string;
  disposition?: 'interested' | 'not-interested' | 'callback' | 'wrong-number' | 'voicemail';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Seed Data - Curated Voice Presets
 * 6-10 professionally curated voices for different use cases
 */
export const SEED_VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'voice-professional-male-1',
    name: 'Professional Male',
    description: 'Clear, confident male voice ideal for business communications',
    voiceId: 'vapi-voice-professional-male-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'male',
    tone: 'professional',
    accent: 'American',
    previewUrl: '/audio/previews/professional-male-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-friendly-female-1',
    name: 'Friendly Female',
    description: 'Warm, approachable female voice for customer engagement',
    voiceId: 'vapi-voice-friendly-female-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'female',
    tone: 'friendly',
    accent: 'American',
    previewUrl: '/audio/previews/friendly-female-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-energetic-male-1',
    name: 'Energetic Male',
    description: 'Upbeat, enthusiastic male voice for sales and promotions',
    voiceId: 'vapi-voice-energetic-male-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'male',
    tone: 'energetic',
    accent: 'American',
    previewUrl: '/audio/previews/energetic-male-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-calm-female-1',
    name: 'Calm Female',
    description: 'Soothing, relaxed female voice for support and consultations',
    voiceId: 'vapi-voice-calm-female-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'female',
    tone: 'calm',
    accent: 'American',
    previewUrl: '/audio/previews/calm-female-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-authoritative-male-1',
    name: 'Authoritative Male',
    description: 'Strong, commanding male voice for notifications and alerts',
    voiceId: 'vapi-voice-authoritative-male-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'male',
    tone: 'authoritative',
    accent: 'American',
    previewUrl: '/audio/previews/authoritative-male-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-neutral-female-1',
    name: 'Neutral Female',
    description: 'Clear, neutral female voice suitable for general purpose',
    voiceId: 'vapi-voice-neutral-female-001',
    provider: 'vapi',
    language: 'en-US',
    gender: 'female',
    tone: 'professional',
    accent: 'Neutral',
    previewUrl: '/audio/previews/neutral-female-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-spanish-male-1',
    name: 'Spanish Male',
    description: 'Native Spanish speaking male voice for bilingual campaigns',
    voiceId: 'vapi-voice-spanish-male-001',
    provider: 'vapi',
    language: 'es-ES',
    gender: 'male',
    tone: 'professional',
    accent: 'Spanish',
    previewUrl: '/audio/previews/spanish-male-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  },
  {
    id: 'voice-british-female-1',
    name: 'British Female',
    description: 'Professional British English female voice for international clients',
    voiceId: 'vapi-voice-british-female-001',
    provider: 'vapi',
    language: 'en-GB',
    gender: 'female',
    tone: 'professional',
    accent: 'British',
    previewUrl: '/audio/previews/british-female-1.mp3',
    isActive: true,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01')
  }
];

/**
 * Helper function to get active voice presets
 */
export function getActiveVoicePresets(): VoicePreset[] {
  return SEED_VOICE_PRESETS.filter(preset => preset.isActive);
}

/**
 * Helper function to get voice preset by ID
 */
export function getVoicePresetById(id: string): VoicePreset | undefined {
  return SEED_VOICE_PRESETS.find(preset => preset.id === id);
}

/**
 * Helper function to get voice presets by tone
 */
export function getVoicePresetsByTone(tone: VoicePreset['tone']): VoicePreset[] {
  return SEED_VOICE_PRESETS.filter(preset => preset.tone === tone && preset.isActive);
}

/**
 * Helper function to get voice presets by gender
 */
export function getVoicePresetsByGender(gender: VoicePreset['gender']): VoicePreset[] {
  return SEED_VOICE_PRESETS.filter(preset => preset.gender === gender && preset.isActive);
}