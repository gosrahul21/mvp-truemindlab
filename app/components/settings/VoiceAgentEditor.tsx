'use client'

import { VoicePreset } from '@/lib/voices';
import { Bot, Save, Settings2 } from 'lucide-react';
import { useState } from 'react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="mt-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 dark:bg-[#11192d]/50 dark:border-gray-800 flex flex-col items-start gap-4">
      
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            Agent Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Save your selected preset and agent instructions.
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Prompt)'}
      </button>

      {showAdvanced && (
        <div className="w-full space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            System Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#0d1220] dark:text-gray-100 placeholder-gray-400"
            placeholder="You are a helpful and professional customer service AI..."
          />
        </div>
      )}

      <div className="w-full pt-4 flex justify-end border-t border-gray-200 dark:border-gray-800 mt-4">
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
  );
}
