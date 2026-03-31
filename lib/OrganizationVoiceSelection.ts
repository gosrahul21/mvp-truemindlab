import type { VoicePreset } from './voicePresets';

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
  previewUrl?: string; // URL to audio preview
}

/**
 * Helper to get active voice selections
 */
export function getActiveVoiceSelections(): OrganizationVoiceSelection[] {
  return [];
}