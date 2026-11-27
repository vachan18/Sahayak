import { useEffect } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

/**
 * Live microphone loudness (0…1) as a MotionValue — no React re-renders per frame.
 * Runs only while `active`; tracks and the AudioContext are released immediately after.
 * If permission is refused or Web Audio is missing it simply stays at 0, and the
 * orb falls back to its gentle idle breathing.
 */
export function useMicLevel(active: boolean): MotionValue<number> {
  const level = useMotionValue(0);

  useEffect(() => {
    if (!active) {
      level.set(0);
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    const AC: typeof AudioContext | undefined = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;

    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        ctx = new AC();
        const src = ctx.createMediaStreamSource(s);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.7;
        src.connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length);
          // Speech RMS sits around 0.02–0.25; map it to a perceptual 0…1
          level.set(Math.min(1, Math.pow(rms * 5, 0.8)));
          raf = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        /* permission refused or no device — orb uses idle animation */
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => undefined);
      level.set(0);
    };
  }, [active, level]);

  return level;
}
