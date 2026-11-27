import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { buildAssistantReply } from '../utils/assistantResponder';

describe('Voice Assistant Upgrade (STT Hook & Scheme Responder)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('configures SpeechRecognition with the active regional language and captures final transcript', () => {
    let instance: any = null;
    class MockSpeechRecognition {
      lang = '';
      continuous = false;
      interimResults = false;
      maxAlternatives = 1;
      onstart: (() => void) | null = null;
      onresult: ((e: any) => void) | null = null;
      onerror: ((e: any) => void) | null = null;
      onend: (() => void) | null = null;
      start = vi.fn(() => {
        this.onstart?.();
      });
      stop = vi.fn();
      abort = vi.fn();
      constructor() {
        instance = this;
      }
    }

    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
    const onFinalResult = vi.fn();

    const { result } = renderHook(() =>
      useSpeechRecognition({ language: 'ta', onFinalResult })
    );

    expect(result.current.isSupported).toBe(true);

    act(() => {
      result.current.startListening();
    });

    expect(instance.lang).toBe('ta-IN');
    expect(instance.interimResults).toBe(true);
    expect(result.current.isListening).toBe(true);

    // Simulate interim result
    act(() => {
      instance.onresult({
        resultIndex: 0,
        results: [{ isFinal: false, 0: { transcript: 'pm kisan' } }],
      });
    });
    expect(result.current.interimTranscript).toBe('pm kisan');

    // Simulate final result
    act(() => {
      instance.onresult({
        resultIndex: 0,
        results: [{ isFinal: true, 0: { transcript: 'pm kisan status' } }],
      });
    });

    expect(result.current.finalTranscript).toBe('pm kisan status');
    expect(result.current.isListening).toBe(false);
    expect(onFinalResult).toHaveBeenCalledWith('pm kisan status');
  });

  it('reports not-allowed error cleanly when microphone permission is denied', () => {
    let instance: any = null;
    class MockSpeechRecognition {
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      onerror: ((e: any) => void) | null = null;
      constructor() {
        instance = this;
      }
    }

    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition);
    const { result } = renderHook(() => useSpeechRecognition({ language: 'en' }));

    act(() => {
      result.current.startListening();
    });

    act(() => {
      instance.onerror({ error: 'not-allowed' });
    });

    expect(result.current.error).toBe('not-allowed');
    expect(result.current.isListening).toBe(false);
  });

  it('matches all scheme, eligibility, and document intents in buildAssistantReply', () => {
    const kisan = buildAssistantReply('Tell me about PM-KISAN', 'en');
    expect(kisan.actionLink?.to).toBe('/schemes/pm-kisan');
    expect(kisan.text).toContain('PM-KISAN');

    const jay = buildAssistantReply('Ayushman Bharat hospital cover', 'ta');
    expect(jay.actionLink?.to).toBe('/schemes/pm-jay');

    const docs = buildAssistantReply('What documents and passbook do I need?', 'en');
    expect(docs.actionLink?.to).toBe('/documents');

    const elig = buildAssistantReply('Check my eligibility', 'bn');
    expect(elig.actionLink?.to).toBe('/eligibility');
  });
});
