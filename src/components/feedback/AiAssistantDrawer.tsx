import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, PaperPlaneRight, SpeakerHigh, SpeakerSlash, ArrowCounterClockwise, ShieldCheck } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { speakVernacularText, stopSpeech } from '../../utils/audioSpeech';
import { SupportedLanguage } from '../../types';
import { LANGUAGE_META } from '../../data/languages';
import { useSpeechRecognition, SpeechErrorCode } from '../../hooks/useSpeechRecognition';
import { buildAssistantReply, AssistantReply } from '../../utils/assistantResponder';
import { Sheet } from '../../ui/Sheet';
import { IconButton } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import { VoiceOrb, MiniOrb, OrbState } from '../voice/VoiceOrb';
import { useMicLevel } from '../voice/useMicLevel';

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionLink?: AssistantReply['actionLink'];
}

const greetingFor = (l: SupportedLanguage) => (LANGUAGE_META[l] || LANGUAGE_META.en).aiGreeting;
const clock = (l: SupportedLanguage) => {
  try {
    return new Date().toLocaleTimeString(`${l}-IN`, { hour: 'numeric', minute: '2-digit' });
  } catch {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
};

const ERROR_KEY: Record<SpeechErrorCode, [string, string]> = {
  'not-allowed': ['entry.voice.err.notAllowed', 'Sahayak needs permission to use the microphone. Allow it in your browser, or type below.'],
  'no-speech': ['entry.voice.err.noSpeech', 'We did not hear anything. Hold the phone a little closer and try again, or type below.'],
  'audio-capture': ['entry.voice.err.audioCapture', 'No microphone was found on this device. You can type your question below.'],
  unsupported: ['entry.voice.err.unsupported', 'This browser cannot listen. Use Chrome or Edge, or type your question below.'],
  network: ['entry.voice.err.network', 'The internet is weak right now. Try again, or type your question below.'],
  unknown: ['entry.voice.err.unknown', 'Something went wrong while listening. Please try again, or type below.'],
};

/** Words of the live transcript fade up one by one as they are recognised. */
function LiveWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span key={`${i}-${w}`} initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }} className="inline-block me-[0.28em]">
          {w}
        </motion.span>
      ))}
    </span>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 h-5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-2 h-2 rounded-full bg-ink-3" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </span>
  );
}

/**
 * SAHAYAK SATHI — voice-first assistant.
 * Before the first question the orb is the whole screen: one big target, one instruction.
 * Once a conversation starts it moves into the composer so answers get the space.
 */
export function AiAssistantDrawer() {
  const navigate = useNavigate();
  const { isAiDrawerOpen, setAiDrawerOpen, language, isAudioAssistanceEnabled } = useAppStore();
  const { t } = useTranslation();

  const idRef = useRef(1);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{ id: 0, sender: 'assistant', text: greetingFor(language), time: clock(language) }]);
  const listEndRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number>();

  const speak = (text: string) => {
    setSpeaking(true);
    speakVernacularText(text, language, () => setSpeaking(false), () => setSpeaking(false));
  };

  const stopTalking = () => {
    stopSpeech();
    setSpeaking(false);
  };

  const handleSend = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    haptic('select');
    stopTalking();
    setMessages((prev) => [...prev, { id: idRef.current++, sender: 'user', text, time: clock(language) }]);
    setInput('');
    setThinking(true);
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const reply = buildAssistantReply(text, language);
      setThinking(false);
      setMessages((prev) => [...prev, { id: idRef.current++, sender: 'assistant', text: reply.text, time: clock(language), actionLink: reply.actionLink }]);
      haptic('success');
      if (isAudioAssistanceEnabled) speak(reply.text);
    }, 650);
  };

  const { isListening, interimTranscript, error: speechError, startListening, stopListening, reset: resetSpeech } = useSpeechRecognition({
    language,
    onFinalResult: (spoken) => handleSend(spoken),
  });

  const level = useMicLevel(isListening && isAiDrawerOpen);

  // Re-greet in the new language if nothing has been asked yet
  useEffect(() => {
    setMessages((prev) => (prev.length === 1 && prev[0].sender === 'assistant' ? [{ ...prev[0], text: greetingFor(language) }] : prev));
  }, [language]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking, interimTranscript, isListening]);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  const hasConversation = messages.some((m) => m.sender === 'user');
  const state: OrbState = isListening ? 'listening' : thinking ? 'thinking' : speaking ? 'speaking' : speechError ? 'error' : 'idle';

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (speaking) {
      stopTalking();
      return;
    }
    resetSpeech();
    startListening();
  };

  const close = () => {
    stopListening();
    stopTalking();
    setAiDrawerOpen(false);
  };

  const restart = () => {
    stopListening();
    stopTalking();
    resetSpeech();
    setThinking(false);
    setMessages([{ id: idRef.current++, sender: 'assistant', text: greetingFor(language), time: clock(language) }]);
  };

  const stateLabel = {
    idle: t('entry.voice.state.idle', 'Tap the circle and speak'),
    listening: t('entry.voice.state.listening', 'Listening… speak now'),
    thinking: t('entry.voice.state.thinking', 'Finding the answer…'),
    speaking: t('entry.voice.state.speaking', 'Speaking…'),
    error: t('entry.voice.state.error', 'Could not hear you'),
  }[state];

  const orbLabel = isListening ? t('entry.voice.stopMic', 'Stop listening') : speaking ? t('entry.voice.stopSpeaking', 'Stop speaking') : t('entry.voice.startMic', 'Start speaking');
  const errorText = speechError && !isListening ? t(...ERROR_KEY[speechError]) : null;
  const suggestions = [t('promptChip1'), t('promptChip2'), t('promptChip3')];
  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;

  const title = (
    <span className="flex items-center gap-2.5">
      {t('entry.voice.title', 'Sahayak Sathi')}
      <span className="h-6 px-2 rounded-full bg-sunken text-micro font-semibold text-ink-2 grid place-items-center">{meta.label}</span>
    </span>
  );
  const description = (
    <span className="inline-flex items-center gap-1.5">
      <ShieldCheck size={16} weight="duotone" className="text-patti" />
      {t('entry.voice.subtitle', 'Answers come from official scheme rules')}
    </span>
  );

  const footer = (
    <div className="space-y-3">
      {/* Suggestions — the question is often "what can I even ask?" */}
      <div>
        <p className="sr-only">{t('entry.voice.suggestions', 'You can ask')}</p>
        <div className="-mx-5 md:-mx-7 px-5 md:px-7 flex gap-2 overflow-x-auto no-scrollbar snap-rail">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSend(s)}
              className="shrink-0 max-w-[80%] truncate h-10 px-4 rounded-full bg-sunken text-small font-medium text-ink hover:bg-neel-tint hover:text-neel-ink transition-colors"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2"
      >
        {hasConversation && (
          <div className="shrink-0 me-1">
            <MiniOrb state={state} level={level} onPress={toggleMic} label={orbLabel} />
          </div>
        )}
        <label className="flex-1 min-w-0">
          <span className="sr-only">{t('entry.voice.typeInstead', 'Or type your question…')}</span>
          <input
            value={isListening && interimTranscript ? interimTranscript : input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('entry.voice.typeInstead', 'Or type your question…')}
            className="w-full h-[52px] px-4 rounded-full bg-sunken text-ink placeholder:text-ink-3 focus:outline-none focus:shadow-[0_0_0_2px_rgb(var(--c-neel))]"
          />
        </label>
        <IconButton type="submit" label={t('entry.voice.send', 'Send')} variant="solid" disabled={!input.trim()} className="!rounded-full disabled:opacity-40 shrink-0">
          <PaperPlaneRight size={22} weight="fill" className="flip-rtl" />
        </IconButton>
      </form>
    </div>
  );

  return (
    <Sheet open={isAiDrawerOpen} onClose={close} title={title} description={description} footer={footer} desktop="side" size="md" closeLabel={t('navClose', 'Close')} className="md:h-full max-md:h-[90dvh]">
      <div className="flex items-center justify-end gap-1 -mt-1 mb-2">
        {speaking && (
          <button type="button" onClick={stopTalking} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-small font-semibold text-ink-2 hover:bg-sunken">
            <SpeakerSlash size={18} /> {t('entry.voice.stopSpeaking', 'Stop speaking')}
          </button>
        )}
        {hasConversation && (
          <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-small font-semibold text-ink-2 hover:bg-sunken">
            <ArrowCounterClockwise size={18} /> {t('entry.voice.newChat', 'Start over')}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!hasConversation ? (
          /* ── Stage: one big target ─────────────────────────────── */
          <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }} className="flex flex-col items-center text-center pt-2 pb-4">
            <VoiceOrb state={state} level={level} onPress={toggleMic} label={orbLabel} size={136} />
            <p aria-live="polite" className={cx('mt-1 text-h3 font-semibold', state === 'error' ? 'text-sindoor' : 'text-ink')}>
              {stateLabel}
            </p>
            <div className="mt-3 min-h-[4.5rem] w-full max-w-sm" aria-live="polite">
              {isListening && interimTranscript ? (
                <LiveWords text={interimTranscript} className="text-lead font-medium text-ink" />
              ) : errorText ? (
                <p className="text-small text-ink-2">{errorText}</p>
              ) : (
                <p className="text-ink-2">{messages[0].text}</p>
              )}
            </div>
            {!isListening && !errorText && (
              <button type="button" onClick={() => speak(messages[0].text)} className="mt-1 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neel-tint text-neel-ink text-small font-semibold">
                <SpeakerHigh size={18} weight="duotone" /> {t('listenInLanguage', 'Listen')}
              </button>
            )}
          </motion.div>
        ) : (
          /* ── Conversation ──────────────────────────────────────── */
          <motion.ol key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-2" aria-live="polite" aria-relevant="additions">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const mine = m.sender === 'user';
                return (
                  <motion.li
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className={cx('flex flex-col', mine ? 'items-end' : 'items-start')}
                  >
                    <span className="sr-only">{mine ? t('entry.voice.you', 'You') : t('entry.voice.sathi', 'Sathi')}:</span>
                    <div
                      className={cx(
                        'max-w-[88%] px-4 py-3 rounded-lg',
                        mine ? 'bg-neel text-on-neel rounded-ee-xs' : 'bg-paper text-ink shadow-hair rounded-es-xs'
                      )}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      {m.actionLink && (
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            const to = m.actionLink!.to;
                            close();
                            navigate(to);
                          }}
                          className="mt-3 w-full inline-flex items-center justify-between gap-2 h-12 ps-4 pe-3 rounded-md bg-haldi text-[#111E33] font-semibold"
                        >
                          <span className="truncate">{m.actionLink.label}</span>
                          <ArrowRight size={18} weight="bold" className="flip-rtl shrink-0" />
                        </motion.button>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 px-1 text-micro text-ink-3">
                      <span className="num">{m.time}</span>
                      {!mine && (
                        <button type="button" onClick={() => speak(m.text)} className="inline-flex items-center gap-1 h-8 font-semibold text-neel-ink hover:underline">
                          <SpeakerHigh size={14} weight="duotone" /> {t('entry.voice.replay', 'Listen again')}
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}

              {isListening && (
                <motion.li key="draft" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-end">
                  <div className="max-w-[88%] px-4 py-3 rounded-lg rounded-ee-xs bg-neel-tint text-neel-ink">
                    {interimTranscript ? <LiveWords text={interimTranscript} /> : <span className="text-small font-semibold">{stateLabel}</span>}
                  </div>
                </motion.li>
              )}

              {thinking && (
                <motion.li key="typing" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex">
                  <div className="px-4 py-3.5 rounded-lg rounded-es-xs bg-paper shadow-hair" role="status" aria-label={stateLabel}>
                    <TypingDots />
                  </div>
                </motion.li>
              )}

              {errorText && (
                <motion.li key="err" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-md bg-sindoor-tint text-sindoor px-4 py-3 text-small font-medium" role="alert">
                  {errorText}
                </motion.li>
              )}
            </AnimatePresence>
          </motion.ol>
        )}
      </AnimatePresence>
      <div ref={listEndRef} />
    </Sheet>
  );
}
