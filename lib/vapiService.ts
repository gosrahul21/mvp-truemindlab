import type { VoicePreset, VoiceCallRecord } from '@/lib/voicePresets';
import type { OrganizationVoiceSelection } from '@/lib/voicePresets';

/**
 * Vapi Service Abstraction Layer
 * Provides a clean interface for Vapi integration
 */
export class VapiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.vapi.ai';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Initialize a Vapi assistant with voice preset
   */
  async createAssistant(voicePreset: VoicePreset): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${voicePreset.name} Assistant`,
          voiceId: voicePreset.voiceId,
          firstMessage: `Hello! How can I assist you today?`,
          model: {
            provider: 'openai',
            model: 'gpt-3.5-turbo',
            temperature: 0.7
          },
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create assistant: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Vapi Assistant Creation Error:', error);
      throw error;
    }
  }

  /**
   * Initiate a phone call using Vapi
   */
  async initiateCall(
    organizationId: string,
    voicePresetId: string,
    toNumber: string,
    fromNumber: string,
    assistantId: string
  ): Promise<VoiceCallRecord> {
    try {
      // First, create a call
      const callResponse = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId,
          phoneNumberId: fromNumber, // Assuming this is a phone number ID from Vapi
          customer: {
            number: toNumber
          }
        })
      });

      if (!callResponse.ok) {
        throw new Error(`Failed to initiate call: ${callResponse.statusText}`);
      }

      const callData = await callResponse.json();

      // Create voice call record
      const voiceCallRecord: VoiceCallRecord = {
        id: `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        organizationId,
        voicePresetId,
        vapiCallId: callData.id,
        status: callData.status as any,
        direction: 'outbound',
        fromNumber,
        toNumber,
        startedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return voiceCallRecord;
    } catch (error) {
      console.error('Vapi Call Initiation Error:', error);
      throw error;
    }
  }

  /**
   * Get call status from Vapi
   */
  async getCallStatus(vapiCallId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${vapiCallId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get call status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Vapi Call Status Error:', error);
      throw error;
    }
  }

  /**
   * End a call
   */
  async endCall(vapiCallId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${vapiCallId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to end call: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Vapi Call End Error:', error);
      throw error;
    }
  }

  /**
   * Get call transcript and summary
   */
  async getCallAnalysis(vapiCallId: string): Promise<{ transcript?: string; summary?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${vapiCallId}/analysis`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        // Some calls might not have analysis yet
        return {};
      }

      const data = await response.json();
      return {
        transcript: data.transcript,
        summary: data.summary
      };
    } catch (error) {
      console.error('Vapi Call Analysis Error:', error);
      return {};
    }
  }
}

/**
 * Mock Vapi Service for development/testing
 * In production, this would be replaced with the actual VapiService
 */
export class MockVapiService extends VapiService {
  constructor() {
    super('mock-api-key');
  }

  async createAssistant(voicePreset: VoicePreset): Promise<any> {
    return {
      id: `mock_assistant_${voicePreset.id}`,
      name: `${voicePreset.name} Assistant`,
      voiceId: voicePreset.voiceId,
      createdAt: new Date().toISOString()
    };
  }

  async initiateCall(
    organizationId: string,
    voicePresetId: string,
    toNumber: string,
    fromNumber: string,
    assistantId: string
  ): Promise<VoiceCallRecord> {
    const callId = `mock_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationId,
      voicePresetId,
      vapiCallId: callId,
      status: 'initiated',
      direction: 'outbound',
      fromNumber,
      toNumber,
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getCallStatus(vapiCallId: string): Promise<any> {
    // Simulate different call statuses based on timestamp
    const now = Date.now();
    const callStart = parseInt(vapiCallId.split('_')[2]) || now;
    const elapsedSeconds = (now - callStart) / 1000;

    if (elapsedSeconds < 5) {
      return { id: vapiCallId, status: 'initiated' };
    } else if (elapsedSeconds < 15) {
      return { id: vapiCallId, status: 'ringing' };
    } else if (elapsedSeconds < 60) {
      return { id: vapiCallId, status: 'in-progress' };
    } else {
      return {
        id: vapiCallId,
        status: 'completed',
        duration: Math.min(Math.floor(elapsedSeconds), 300),
        endedAt: new Date(now).toISOString()
      };
    }
  }

  async endCall(vapiCallId: string): Promise<any> {
    return { id: vapiCallId, status: 'ended' };
  }

  async getCallAnalysis(vapiCallId: string): Promise<{ transcript?: string; summary?: string }> {
    // Return mock analysis for completed calls
    const now = Date.now();
    const callStart = parseInt(vapiCallId.split('_')[2]) || now;
    const elapsedSeconds = (now - callStart) / 1000;

    if (elapsedSeconds > 10) {
      return {
        transcript: "Hello, this is a test call from CloseFlow AI. I'm calling to follow up on your recent inquiry about our services. Is now a good time to discuss how we can help you improve your sales process?",
        summary: "Customer expressed interest in learning more about pricing and features. Requested callback tomorrow afternoon."
      };
    }

    return {};
  }
}

/**
 * Factory function to create appropriate Vapi service
 */
export function createVapiService(): VapiService {
  // In development, use mock service
  if (process.env.NODE_ENV === 'development') {
    return new MockVapiService();
  }

  // In production, use real service with API key from env
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) {
    console.warn('VAPI_API_KEY not found, falling back to mock service');
    return new MockVapiService();
  }

  return new VapiService(apiKey);
}