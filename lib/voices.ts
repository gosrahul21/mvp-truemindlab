export type VoiceProvider = '11labs' | 'deepgram' | 'playht';

export const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'en-US' },
  { label: 'Hindi', value: 'hi-IN' }
];

export interface VoicePreset {
  id: string;
  name: string;
  tone: string;
  provider: VoiceProvider;
  providerVoiceId: string;
  previewUrl: string;
  gender: 'female' | 'male';
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'warm-female',
    name: 'Sarah - Warm Female',
    tone: 'Compassionate and welcoming',
    provider: '11labs',
    providerVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Example 11labs voice ID
    previewUrl: '/elevenlabs_hindi_girl.mp3',
    gender: 'female',
  },
  {
    id: 'professional-female',
    name: 'Emma - Professional Female',
    tone: 'Clear, authoritative, professional',
    provider: '11labs',
    providerVoiceId: 'MF3mGyEYCl7XYWbV9V6O',
    previewUrl: '/elevenlabs_hindi_girl.mp3',
    gender: 'female',
  },
  {
    id: 'friendly-female',
    name: 'Aster - Friendly Female',
    tone: 'Enthusiastic and energetic',
    provider: 'deepgram',
    providerVoiceId: 'aster', // Deepgram aura voice example
    previewUrl: '/elevenlabs_hindi_girl.mp3',
    gender: 'female',
  },
  {
    id: 'confident-male',
    name: 'Arnold - Confident Male',
    tone: 'Assertive and confident',
    provider: '11labs',
    providerVoiceId: 'VR6AewLTigWG4xSOukaG',
    previewUrl: '/audio/confident-male.mp3',
    gender: 'male',
  },
  {
    id: 'professional-male',
    name: 'Orion - Professional Male',
    tone: 'Trustworthy and serious',
    provider: 'deepgram',
    providerVoiceId: 'orion',
    previewUrl: '/audio/professional-male.mp3',
    gender: 'male',
  },
  {
    id: 'conversational-male',
    name: 'Adam - Conversational Male',
    tone: 'Casual and relaxed',
    provider: '11labs',
    providerVoiceId: 'pNInz6obpgDQGcFmaJgB',
    previewUrl: '/audio/conversational-male.mp3',
    gender: 'male',
  },
  {
    id: 'premium-female',
    name: 'Premium Voice (Coming Soon)',
    tone: 'Ultra-realistic placeholder',
    provider: '11labs',
    providerVoiceId: 'TxGEqnHWrfWFTfGW9XjX',
    previewUrl: '/elevenlabs_hindi_girl.mp3',
    gender: 'female',
  }
];

// Helper to generate a baseline prompt text based on organization details
export function generateBaselinePrompt(orgName?: string, primaryOffer?: string, location?: string): string {
  const name = orgName || '[Organization Name]';
  const offer = primaryOffer ? `We specialize in ${primaryOffer}.` : '';
  const loc = location ? `We are located in ${location}.` : '';

  return `You are a helpful and professional customer service AI representative for ${name}. 
Your goal is to answer incoming questions, qualify leads, and ultimately help book appointments.

${offer}
${loc}

Guidelines:
1. Always be polite and conversational.
2. Keep your answers concise, ideally under 2 sentences unless explaining something complex.
3. If the user asks something outside of your knowledge, politely let them know someone from the team will follow up.

Before ending the call, ensure you thank the caller.`;
}

// Generate the Vapi configuration JSON structure
export function generateVapiConfig(preset: VoicePreset, promptText: string, language: string = 'en-US'): Record<string, any> {
  const voiceConfig = preset.provider === 'deepgram' 
    ? {
        provider: 'deepgram',
        voiceId: preset.providerVoiceId
      }
    : {
        provider: '11labs',
        voiceId: preset.providerVoiceId,
        stability: 0.5,
        similarityBoost: 0.5
      };

  return {
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: promptText
        }
      ]
    },
    voice: voiceConfig,
    language,
    recordingEnabled: true
  };
}
