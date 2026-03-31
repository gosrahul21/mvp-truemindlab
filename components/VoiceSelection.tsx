import { useState } from 'react';
import type { VoicePreset } from '@/lib/voicePresets';
import { getActiveVoicePresets, getVoicePresetById } from '@/lib/voicePresets';

interface VoiceSelectionProps {
  onVoiceSelected: (voicePreset: VoicePreset) => void;
  initialVoiceId?: string;
}

export default function VoiceSelection({ onVoiceSelected, initialVoiceId }: VoiceSelectionProps) {
  const [voicePresets] = useState<VoicePreset[]>(getActiveVoicePresets);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(initialVoiceId || '');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize selected voice if not provided
  if (!selectedVoiceId && voicePresets.length > 0) {
    setSelectedVoiceId(voicePresets[0].id);
  }

  const selectedVoice = voicePresets.find(vp => vp.id === selectedVoiceId) || voicePresets[0];

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    const voice = getVoicePresetById(voiceId);
    if (voice && onVoiceSelected) {
      onVoiceSelected(voice);
    }
  };

  const handlePreview = async () => {
    if (!selectedVoice?.previewUrl) return;

    setIsPreviewing(true);
    try {
      const audio = new Audio(selectedVoice.previewUrl);
      setPreviewAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handlePreviewEnd = () => {
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      setPreviewAudio(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-2xl p-6 bg-white/5 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Select Your Voice</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {voicePresets.map((voice) => (
            <VoiceOption
              key={voice.id}
              voice={voice}
              isSelected={voice.id === selectedVoiceId}
              onSelect={() => handleVoiceSelect(voice.id)}
              onPreview={handlePreview}
              isPreviewing={isPreviewing && voice.id === selectedVoiceId}
            />
          ))}
        </div>
      </div>

      {selectedVoice && (
        <div className="border rounded-2xl p-6 bg-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Selected Voice</h3>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full">
              <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.207 8.207a4 4 0 015.656 0L12 14.207m0 0a4 4 0 015.656 0l1.414-1.414A4 4 0 0012 6.207m-3.03 7.966a6 6 0 01-8.485 0l-.293-.293a6 6 0 018.485-8.485v.001"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{selectedVoice.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedVoice.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary">{selectedVoice.tone}</span>
                <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary">{selectedVoice.gender}</span>
                {selectedVoice.accent && (
                  <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary">{selectedVoice.accent}</span>
                )}
              </div>
            </div>
          </div>

          {!isPreviewing && (
            <button
              onClick={handlePreview}
              className="mt-4 flex h-10 items-center justify-center gap-2 rounded-border px-4 py-2 text-sm font-semibold transition-all hover:bg-primary/10"
            >
              {isPreviewing ? 'Playing...' : 'Preview Voice'}
              {!isPreviewing && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5l6 6-6 6"/>
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface VoiceOptionProps {
  voice: VoicePreset;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  isPreviewing: boolean;
}

function VoiceOption({ voice, isSelected, onSelect, onPreview, isPreviewing }: VoiceOptionProps) {
  return (
    <div
      className={`cursor-pointer border rounded-xl p-4 hover:bg-primary/5 transition-all
                 ${isSelected ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 flex items-center justify-center bg-primary/10 rounded-full">
          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div>
          <h4 className="font-medium">{voice.name}</h4>
          <p className="text-sm text-muted-foreground">{voice.description}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="px-1.5 py-0 text-xs rounded bg-primary/20 text-primary">{voice.tone}</span>
            <span className="px-1.5 py-0 text-xs rounded bg-primary/20 text-primary">{voice.gender}</span>
          </div>
        </div>
      </div>

      {!isPreviewing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="mt-2 h-8 w-8 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l2-2-2-2m2 16l2-2-2-2"/>
          </svg>
        </button>
      )}

      {isPreviewing && (
        <div className="mt-2 h-2 w-full bg-primary/20 rounded overflow-hidden">
          <div className="h-2 w-1/2 bg-primary rounded transition-all duration-500"
               style={{ width: Math.random() * 100 + '%' }}></div>
        </div>
      )}
    </div>
  );
}