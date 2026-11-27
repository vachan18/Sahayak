import { useState, useRef, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGE_META } from '../data/languages';
import { stopSpeech } from '../utils/audioSpeech';

export type SpeechErrorCode =
  | 'unsupported'
  | 'not-allowed'
  | 'no-speech'
  | 'audio-capture'
  | 'network'
  | 'unknown';

interface UseSpeechRecognitionOptions {
  language: SupportedLanguage;
  onFinalResult?: (transcript: string) => void;
}

export function getSpeechRecognitionConstructor(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function useSpeechRecognition({ language, onFinalResult }: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<SpeechErrorCode | null>(null);

  const recognitionRef = useRef<any>(null);
  const onFinalResultRef = useRef(onFinalResult);
  onFinalResultRef.current = onFinalResult;

  const isSupported = Boolean(getSpeechRecognitionConstructor());

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors if already ended
      }
    }
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
  }, []);

  const startListening = useCallback(() => {
    stopSpeech();
    setError(null);
    setInterimTranscript('');
    setFinalTranscript('');

    const SpeechRecognitionClass = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionClass) {
      setError('unsupported');
      setIsListening(false);
      return false;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort errors
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.lang = (LANGUAGE_META[language] || LANGUAGE_META.en).speechLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalText += text;
          } else {
            interim += text;
          }
        }

        if (interim) {
          setInterimTranscript(interim.trim());
        }

        if (finalText.trim()) {
          const clean = finalText.trim();
          setFinalTranscript(clean);
          setInterimTranscript('');
          setIsListening(false);
          onFinalResultRef.current?.(clean);
        }
      };

      recognition.onerror = (event: any) => {
        const err = event?.error as string | undefined;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setError('not-allowed');
        } else if (err === 'no-speech') {
          setError('no-speech');
        } else if (err === 'audio-capture') {
          setError('audio-capture');
        } else if (err === 'network') {
          setError('network');
        } else if (err !== 'aborted') {
          setError('unknown');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
      return true;
    } catch {
      setError('unknown');
      setIsListening(false);
      return false;
    }
  }, [language]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    startListening,
    stopListening,
    reset,
  };
}
