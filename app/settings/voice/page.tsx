'use client'

import { useState, useEffect } from 'react';
import VoicePresetLibrary from '@/app/components/settings/VoicePresetLibrary';
import VoiceAgentEditor from '@/app/components/settings/VoiceAgentEditor';
import { VoicePreset, VOICE_PRESETS, generateBaselinePrompt, generateVapiConfig, AVAILABLE_LANGUAGES } from '@/lib/voices';
import { Globe } from 'lucide-react';

export default function VoiceSettingsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('en-US');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings/voice');
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            setSelectedPresetId(data.preset_id || '');
            setPrompt(data.prompt || '');
            if (data.language) setLanguage(data.language);
          } else {
            // New user, generate a baseline prompt
            // Ideally we'd pass org name here if we fetched it
            setPrompt(generateBaselinePrompt());
          }
        }
      } catch (err) {
        console.error('Failed to load voice settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSelectPreset = (preset: VoicePreset) => {
    setSelectedPresetId(preset.id);
  };

  const handleSave = async () => {
    if (!selectedPresetId || !prompt || !language) return;
    
    setIsSaving(true);
    try {
      const activePreset = VOICE_PRESETS.find(p => p.id === selectedPresetId);
      if (!activePreset) return;

      const vapi_config = generateVapiConfig(activePreset, prompt, language);

      const res = await fetch('/api/settings/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preset_id: selectedPresetId,
          language,
          prompt,
          vapi_config
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      // Success feedback could be added here
      alert('Voice Agent Configuration Saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving voice configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const activePreset = VOICE_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Voice Agent Configuration</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Assign a voice profile and define the specific role and instructions for your AI agent. 
        These settings will be used to generate your Vapi-ready integration configuration.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 dark:bg-[#11192d]/50 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <label htmlFor="language-select" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Agent Language:
              </label>
            </div>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 max-w-xs rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-100 shadow-sm"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <VoicePresetLibrary 
            selectedPresetId={selectedPresetId} 
            onSelect={handleSelectPreset} 
          />
          
          <VoiceAgentEditor 
            selectedPreset={activePreset}
            prompt={prompt}
            setPrompt={setPrompt}
            language={language}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </>
      )}
    </section>
  )
}
