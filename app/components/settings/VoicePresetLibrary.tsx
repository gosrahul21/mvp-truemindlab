'use client'

import { VoicePreset, VOICE_PRESETS } from '@/lib/voices';
import { PlayCircle, CheckCircle2, PauseCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface VoicePresetLibraryProps {
  selectedPresetId: string;
  onSelect: (preset: VoicePreset) => void;
}

export default function VoicePresetLibrary({
  selectedPresetId,
  onSelect
}: VoicePresetLibraryProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayToggle = (presetId: string, previewUrl: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    // Simplistic placeholder audio toggling logic
    if (playingId === presetId) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const newAudio = new Audio(previewUrl);
      
      // Since it's a placeholder, if the file doesn't exist, we just simulate playback visual
      newAudio.onerror = () => {
        // Mock a 3 second playback for demo purposes when file is missing
        setPlayingId(presetId);
        setTimeout(() => setPlayingId(null), 3000);
      };

      newAudio.onended = () => {
        setPlayingId(null);
      };

      newAudio.play().catch(err => {
        console.warn('Audio playback failed (expected if placeholder missing):', err);
        setPlayingId(presetId);
        setTimeout(() => setPlayingId(null), 3000);
      });

      audioRef.current = newAudio;
      setPlayingId(presetId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Select a Voice Preset</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VOICE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const isPlaying = playingId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 group flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-900/20 shadow-sm ring-1 ring-indigo-500/50'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-[#11192d] dark:hover:border-indigo-900/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-indigo-500 dark:text-indigo-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              
              <div className="pr-8">
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {preset.name}
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400 capitalize">
                    {preset.provider}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {preset.tone}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                <button
                  onClick={(e) => handlePlayToggle(preset.id, preset.previewUrl, e)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isPlaying 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
                  }`}
                >
                  {isPlaying ? (
                    <><PauseCircle className="w-5 h-5 animate-pulse" /> Playing...</>
                  ) : (
                    <><PlayCircle className="w-5 h-5" /> Preview</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
