import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speakVernacularText } from '../utils/audioSpeech';

describe('Welcome Voice & Speech Utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('speaks "Welcome to Sahayak" in English with en-IN locale', () => {
    const speakMock = vi.fn();
    const cancelMock = vi.fn();
    const getVoicesMock = vi.fn(() => [
      { lang: 'en-IN', name: 'English India' } as SpeechSynthesisVoice,
    ]);

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: speakMock,
        cancel: cancelMock,
        getVoices: getVoicesMock,
      },
    });

    class MockUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: SpeechSynthesisVoice | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: { error: string }) => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    speakVernacularText('Welcome to Sahayak', 'en');

    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(speakMock).toHaveBeenCalledTimes(1);
    const spokenUtterance = speakMock.mock.calls[0][0];
    expect(spokenUtterance.text).toBe('Welcome to Sahayak');
    expect(spokenUtterance.lang).toBe('en-IN');
  });

  it('invokes onError callback when speech synthesis is blocked (not-allowed)', () => {
    const speakMock = vi.fn((utterance: any) => {
      if (utterance.onerror) {
        utterance.onerror({ error: 'not-allowed' });
      }
    });

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: speakMock,
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
      },
    });

    class MockUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: SpeechSynthesisVoice | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: { error: string }) => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    const onError = vi.fn();
    speakVernacularText('Welcome to Sahayak', 'en', undefined, onError);

    expect(onError).toHaveBeenCalledWith('not-allowed');
  });

  it('falls back to audible phonetic greeting when native regional OS voice is not installed', () => {
    const speakMock = vi.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak: speakMock,
        cancel: vi.fn(),
        getVoices: vi.fn(() => [
          { lang: 'en-IN', name: 'Microsoft Ravi' } as SpeechSynthesisVoice,
        ]),
      },
    });

    class MockUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: SpeechSynthesisVoice | null = null;
      onend: (() => void) | null = null;
      onerror: ((e: { error: string }) => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);

    speakVernacularText('வணக்கம்! அரசுத் திட்டங்களை அறிய இது உங்கள் சகாயக்.', 'ta');

    expect(speakMock).toHaveBeenCalledTimes(1);
    const spokenUtterance = speakMock.mock.calls[0][0];
    expect(spokenUtterance.text).toBe('Vanakkam! Sahayak Tamil selected.');
    expect(spokenUtterance.lang).toBe('en-IN');
  });
});
