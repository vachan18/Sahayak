import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { Chip } from '../../ui/Chip';
import { ListenButton } from '../../ui/ListenButton';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { staggerParent, riseIn } from '../../ui/motion';
import { MockDocument, Flaw } from './MockDocument';
import type { SampleKind } from './paperInfo';

interface VisualDosAndDontsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which paper to open on */
  initialKind?: SampleKind;
}

const EXAMPLES: { flaw: Flaw; good: boolean; titleKey: string; title: string; tipKey: string; tip: string }[] = [
  { flaw: 'none', good: true, titleKey: 'documents.guide.good', title: 'Good photo', tipKey: 'documents.guide.goodTip', tip: 'Flat on a table, all four corners visible, every number readable.' },
  { flaw: 'blur', good: false, titleKey: 'documents.guide.blur', title: 'Blurry', tipKey: 'documents.guide.blurTip', tip: 'Hold the phone with both hands and tap the screen to focus before taking the photo.' },
  { flaw: 'glare', good: false, titleKey: 'documents.guide.glare', title: 'Shine or glare', tipKey: 'documents.guide.glareTip', tip: 'Move away from the window or tube light, and tilt the paper slightly.' },
  { flaw: 'cropped', good: false, titleKey: 'documents.guide.cropped', title: 'Corner cut off', tipKey: 'documents.guide.croppedTip', tip: 'Step back a little so the whole page fits inside the frame.' },
];

/**
 * "What a good photo looks like" — the single biggest cause of rejection is a
 * bad photo, so we show it instead of describing it. Swipe on phones, grid on desktop.
 */
export const VisualDosAndDontsModal = ({ isOpen, onClose, initialKind = 'passbook' }: VisualDosAndDontsModalProps) => {
  const { t } = useTranslation();
  const [kind, setKind] = useState<SampleKind>(initialKind);

  useEffect(() => {
    if (isOpen) setKind(initialKind);
  }, [isOpen, initialKind]);

  const spoken = EXAMPLES.map((e) => `${t(e.titleKey, e.title)}. ${t(e.tipKey, e.tip)}`).join(' ');

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={t('documents.guide.title', 'What a good photo looks like')}
      description={t('documents.guide.subtitle', 'Most papers are turned back because the photo is hard to read. Compare before you take yours.')}
      closeLabel={t('navClose', 'Close')}
      footer={
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <ListenButton text={spoken} />
          <Button variant="solid" onClick={onClose}>
            {t('documents.guide.gotIt', 'Got it')}
          </Button>
        </div>
      }
    >
      <div role="group" aria-label={t('documents.guide.which', 'Which paper?')} className="-mx-5 px-5 md:mx-0 md:px-0 flex gap-2 overflow-x-auto no-scrollbar mb-5">
        {(
          [
            ['passbook', 'documents.kind.passbook', 'Passbook'],
            ['land', 'documents.kind.land', 'Land record'],
            ['id', 'documents.kind.id', 'ID card'],
            ['certificate', 'documents.kind.certificate', 'Certificate'],
          ] as [SampleKind, string, string][]
        ).map(([k, key, f]) => (
          <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>
            {t(key, f)}
          </Chip>
        ))}
      </div>

      <motion.ul
        key={kind}
        variants={staggerParent(0.06)}
        initial="hidden"
        animate="show"
        className="-mx-5 px-5 scroll-px-5 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 gap-3 overflow-x-auto md:overflow-visible snap-rail no-scrollbar pb-1"
      >
        {EXAMPLES.map((e) => (
          <motion.li key={e.flaw} variants={riseIn} className="w-[78%] xs:w-[70%] md:w-auto shrink-0 min-w-0">
            <figure className={cx('h-full rounded-lg overflow-hidden bg-surface', e.good ? 'shadow-[0_0_0_2px_rgb(var(--c-patti))]' : 'shadow-hair')}>
              <div className="relative">
                <MockDocument kind={kind} flaw={e.flaw} className="w-full h-auto block" />
                <span
                  className={cx(
                    'absolute top-2.5 start-2.5 inline-flex items-center gap-1.5 h-8 ps-2 pe-3 rounded-full text-small font-semibold',
                    e.good ? 'bg-patti text-white' : 'bg-sindoor text-white'
                  )}
                >
                  {e.good ? <CheckCircle size={18} weight="fill" /> : <XCircle size={18} weight="fill" />}
                  {t(e.titleKey, e.title)}
                </span>
              </div>
              <figcaption className="p-4 text-small text-ink-2">{t(e.tipKey, e.tip)}</figcaption>
            </figure>
          </motion.li>
        ))}
      </motion.ul>
    </Sheet>
  );
};

export default VisualDosAndDontsModal;
