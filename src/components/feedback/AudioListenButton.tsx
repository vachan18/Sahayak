import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speakVernacularText, stopSpeech } from '../../utils/audioSpeech';
import { useAppStore } from '../../store/useAppStore';

interface AudioListenButtonProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'button' | 'icon';
  className?: string;
}

export const AudioListenButton: React.FC<AudioListenButtonProps> = ({
  textToSpeak,
  label = "ಕೇಳಿ (Listen)",
  size = 'md',
  variant = 'pill',
  className = ''
}) => {
  const { language, isAudioAssistanceEnabled } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakVernacularText(textToSpeak, language, () => {
        setIsPlaying(false);
      });
    }
  };

  if (!isAudioAssistanceEnabled && variant !== 'icon') {
    return null;
  }

  const baseClasses = "inline-flex items-center gap-1.5 font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500";

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        aria-label="Play spoken audio"
        title="Listen in your language"
        className={`${baseClasses} p-2 rounded-full ${isPlaying ? 'bg-amber-600 text-white animate-pulse' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200'} ${className}`}
      >
        {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      aria-label="Play spoken audio"
      className={`${baseClasses} ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'} rounded-full ${
        isPlaying
          ? 'bg-amber-600 text-white ring-2 ring-amber-400 animate-pulse'
          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <div className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-3 bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-2 bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-3.5 bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>ನಿಲ್ಲಿಸಿ (Stop)</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
