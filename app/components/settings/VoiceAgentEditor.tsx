'use client'

import { VoicePreset, generateVapiConfig, AVAILABLE_LANGUAGES } from '@/lib/voices';
import { Bot, FileJson, Save } from 'lucide-react';
import { useMemo } from 'react';

interface VoiceAgentEditorProps {
  selectedPreset: VoicePreset | undefined;
  prompt: string;
  setPrompt: (value: string) => void;
  language: string;
  onSave: () => void;
  isSaving: boolean;
}

export default function VoiceAgentEditor({
  selectedPreset,
  prompt,
  setPrompt,
  language,
  onSave,
  isSaving
}: VoiceAgentEditorProps) {

  // Dynamically generate the viewable JSON configuration
  const currentConfigStr = useMemo(() => {
    if (!selectedPreset) return '{\n  // Please select a preset voice first\n}';
    const config = generateVapiConfig(selectedPreset, prompt, language);
    return JSON.stringify(config, null, 2);
  }, [selectedPreset, prompt, language]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 dark:bg-[#11192d]/50 dark:border-gray-800">
      
      {/* Left Column: Prompt Editor */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Agent System Prompt
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This prompt instructs the AI on how to handle the conversation, what its persona is, and what to offer.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-100 placeholder-gray-400"
          placeholder="You are a helpful and professional customer service AI..."
        />

        <div className="pt-4 flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving || !selectedPreset || !prompt}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      {/* Right Column: JSON Config Viewer */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileJson className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vapi API Structure
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This payload is generated dynamically and is ready to be loaded into Vapi.ai's configuration.
        </p>

        <div className="flex-1 rounded-xl bg-gray-900/95 dark:bg-[#080d1a] border border-gray-800 p-4 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-indigo-500/50" />
          <pre className="text-xs font-mono text-emerald-400 overflow-auto h-full max-h-[400px]">
            <code>{currentConfigStr}</code>
          </pre>
        </div>
      </div>
      
    </div>
  );
}
