import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, HandCoins, ArrowLeft, Copy, WhatsappLogo, ArrowSquareOut, Phone, ShieldCheck, CaretRight, Check } from '@phosphor-icons/react';
import type { ApplicationRecord } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { TextField, SelectField, TextArea } from '../../ui/Field';
import { Chip } from '../../ui/Chip';
import { cx } from '../../ui/cx';
import { ease } from '../../ui/motion';
import { openWhatsApp } from '../../lib/share';
import { haptic } from '../../lib/haptics';

export type GrievancePath = 'late' | 'fee';

interface GrievanceGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationRecord;
  /** Open straight onto one path (e.g. /tracker?report=fee) */
  initialPath?: GrievancePath;
}

const CPGRAMS = 'https://pgportal.gov.in';
const STATE_LINE = '1902';
const CSC_LINE = '1800-121-3468';

type Who = 'operator' | 'agent' | 'official' | 'other';

/**
 * Complaint flow — two plain-language doors instead of a wall of legal text.
 *  1. "My application is late"   → pre-filled delay complaint with token, dates and days overdue
 *  2. "Someone asked me for money" → overcharge / bribe report (amount, place, who)
 * Both end in a ready-to-send complaint in the user's language, the official CPGRAMS portal,
 * free helplines, and WhatsApp (how most families actually pass this on).
 */
export const GrievanceGuidanceModal: React.FC<GrievanceGuidanceModalProps> = ({ isOpen, onClose, application, initialPath }) => {
  const { t } = useTranslation();
  const { applications, schemes, pushToast } = useAppStore();
  const [path, setPath] = useState<GrievancePath | null>(initialPath ?? null);
  const [appId, setAppId] = useState<string>(application?.id ?? '');
  const [amount, setAmount] = useState('');
  const [where, setWhere] = useState('');
  const [who, setWho] = useState<Who>('operator');
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPath(initialPath ?? null);
      setAppId(application?.id ?? (initialPath === 'fee' ? '' : applications[0]?.id ?? ''));
      setCopied(false);
    }
  }, [isOpen, initialPath, application, applications]);

  const app = applications.find((a) => a.id === appId);
  const scheme = app ? schemes.find((s) => s.id === app.schemeId) : undefined;
  const schemeName = scheme ? t(scheme.titleKey, app?.schemeTitle) : app?.schemeTitle ?? '';
  const schemeLine = scheme?.helplinePhone?.split('/')[0]?.trim();

  const letter = useMemo(() => {
    const L: string[] = [];
    if (path === 'late') {
      L.push(t('tracker.g.letter.lateSubject'), '', t('tracker.g.letter.lateBody'), '');
      if (app) {
        L.push(`${t('tracker.g.letter.scheme')}: ${schemeName}`);
        L.push(`${t('tracker.g.letter.token')}: ${app.tokenNumber}`);
        L.push(`${t('tracker.g.letter.submitted')}: ${app.submittedAt}`);
        L.push(`${t('tracker.g.letter.limit')}: ${app.slaDeadlineDays} ${t('tracker.detail.days', 'days')}`);
        if (app.slaDaysRemaining < 0) L.push(`${t('tracker.g.letter.overdue')}: ${Math.abs(app.slaDaysRemaining)}`);
        L.push(`${t('tracker.detail.office', 'Office')}: ${app.handlingOffice}`);
      }
    } else if (path === 'fee') {
      L.push(t('tracker.g.letter.feeSubject'), '', t('tracker.g.letter.feeBody'), '');
      if (amount) L.push(`${t('tracker.g.letter.amount')}: ₹${amount}`);
      if (where) L.push(`${t('tracker.g.letter.where')}: ${where}`);
      L.push(`${t('tracker.g.letter.who')}: ${t(`tracker.g.who.${who}`)}`);
      if (app) {
        L.push(`${t('tracker.g.letter.scheme')}: ${schemeName}`);
        L.push(`${t('tracker.g.letter.token')}: ${app.tokenNumber}`);
      }
      if (details.trim()) L.push(`${t('tracker.g.letter.details')}: ${details.trim()}`);
    }
    L.push('', t('tracker.g.letter.close'));
    return L.join('\n');
  }, [path, app, schemeName, amount, where, who, details, t]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
    } catch {
      /* clipboard blocked — text is still selectable */
    }
    haptic('success');
    setCopied(true);
    pushToast({ message: t('tracker.g.copied', 'Complaint copied'), tone: 'success' });
    setTimeout(() => setCopied(false), 2400);
  };

  const doors: { id: GrievancePath; icon: React.ReactNode; title: string; sub: string; tone: string }[] = [
    { id: 'late', icon: <Clock size={28} weight="duotone" />, title: t('tracker.g.pathLate', 'My application is late'), sub: t('tracker.g.pathLateSub'), tone: 'bg-kesar-tint text-kesar' },
    { id: 'fee', icon: <HandCoins size={28} weight="duotone" />, title: t('tracker.g.pathFee', 'Someone asked me for money'), sub: t('tracker.g.pathFeeSub'), tone: 'bg-sindoor-tint text-sindoor' },
  ];

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      title={path ? (path === 'late' ? t('tracker.g.pathLate') : t('tracker.g.pathFee')) : t('tracker.g.title', 'Raise a complaint')}
      description={path ? undefined : t('tracker.g.subtitle')}
      closeLabel={t('navClose', 'Close')}
      size="md"
      desktop="side"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!path ? (
          <motion.div key="doors" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.24, ease: ease.out } }} exit={{ opacity: 0, x: -16, transition: { duration: 0.14 } }} className="space-y-3 pt-1">
            {doors.map((d) => (
              <motion.button
                key={d.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic('select');
                  setPath(d.id);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-surface shadow-hair hover:shadow-lift transition-shadow text-start"
              >
                <span className={cx('w-14 h-14 rounded-md grid place-items-center shrink-0', d.tone)}>{d.icon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-lead">{d.title}</span>
                  <span className="block text-small text-ink-2">{d.sub}</span>
                </span>
                <CaretRight size={20} className="text-ink-3 flip-rtl" />
              </motion.button>
            ))}
            <p className="flex items-start gap-2 pt-3 text-small text-ink-2">
              <ShieldCheck size={20} weight="duotone" className="text-patti shrink-0" />
              {t('tracker.g.safe')}
            </p>
          </motion.div>
        ) : (
          <motion.div key={path} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.24, ease: ease.out } }} exit={{ opacity: 0, x: 16, transition: { duration: 0.14 } }} className="space-y-5 pt-1">
            {!initialPath && (
              <button type="button" onClick={() => setPath(null)} className="inline-flex items-center gap-1.5 h-10 -ms-1 px-1 text-small font-semibold text-neel-ink">
                <ArrowLeft size={16} weight="bold" className="flip-rtl" /> {t('tracker.g.back', 'Choose again')}
              </button>
            )}

            {path === 'late' ? (
              <p className="text-ink-2">{t('tracker.g.lateIntro')}</p>
            ) : (
              <p className="p-4 rounded-md bg-haldi-tint text-ink text-small font-medium">{t('tracker.g.remember')}</p>
            )}

            <SelectField label={t('tracker.g.application', 'Which application?')} value={appId} onChange={(e) => setAppId(e.target.value)}>
              {path === 'fee' && <option value="">{t('tracker.g.none', 'Not about a specific application')}</option>}
              {applications.map((a) => {
                const s = schemes.find((x) => x.id === a.schemeId);
                return (
                  <option key={a.id} value={a.id}>
                    {(s ? t(s.titleKey, a.schemeTitle) : a.schemeTitle).split('(')[0].trim()} · {a.tokenNumber}
                  </option>
                );
              })}
            </SelectField>

            {path === 'fee' && (
              <div className="space-y-4">
                <TextField label={t('tracker.g.amount', 'How much did they ask for? (₹)')} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, '').slice(0, 7))} className="num" />
                <div>
                  <p className="text-small font-semibold mb-2">{t('tracker.g.who', 'Who asked?')}</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label={t('tracker.g.who', 'Who asked?')}>
                    {(['operator', 'agent', 'official', 'other'] as Who[]).map((w) => (
                      <Chip key={w} selected={who === w} onClick={() => setWho(w)} checkable>
                        {t(`tracker.g.who.${w}`)}
                      </Chip>
                    ))}
                  </div>
                </div>
                <TextField label={t('tracker.g.where', 'Where did this happen?')} placeholder={t('tracker.g.wherePh')} value={where} onChange={(e) => setWhere(e.target.value)} />
                <TextArea label={t('tracker.g.details', 'What happened? (optional)')} placeholder={t('tracker.g.detailsPh')} value={details} onChange={(e) => setDetails(e.target.value)} className="min-h-[96px]" />
              </div>
            )}

            <ol className="space-y-2">
              {['tracker.g.step1', 'tracker.g.step2', 'tracker.g.step3'].map((k, i) => (
                <li key={k} className="flex items-center gap-3 text-small">
                  <span className="w-7 h-7 rounded-full bg-ink text-paper grid place-items-center num text-micro font-semibold shrink-0">{i + 1}</span>
                  {t(k)}
                </li>
              ))}
            </ol>

            <div>
              <p className="text-small font-semibold mb-2">{t('tracker.g.complaintText', 'Your complaint, ready to send')}</p>
              <pre className="whitespace-pre-wrap break-words font-sans text-small leading-body p-4 rounded-md bg-sunken text-ink max-h-64 overflow-y-auto">{letter}</pre>
              <div className="mt-3 grid grid-cols-1 xs:grid-cols-2 gap-2">
                <Button variant="solid" onClick={copy} iconStart={copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}>
                  {copied ? t('tracker.g.copied', 'Complaint copied') : t('tracker.g.copy', 'Copy text')}
                </Button>
                <Button variant="secondary" onClick={() => openWhatsApp(letter)} iconStart={<WhatsappLogo size={20} weight="fill" className="text-[#1F9D55]" />}>
                  {t('tracker.g.whatsapp', 'Send on WhatsApp')}
                </Button>
              </div>
            </div>

            <a href={CPGRAMS} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-lg bg-neel-tint text-neel-ink hover:brightness-[0.97] transition">
              <ArrowSquareOut size={26} weight="duotone" className="shrink-0" />
              <span className="min-w-0">
                <span className="block font-semibold">{t('tracker.g.portal', 'Open CPGRAMS portal')}</span>
                <span className="block text-micro opacity-85">{t('tracker.g.portalHint')}</span>
              </span>
            </a>

            <div>
              <p className="text-small font-semibold mb-2">{t('tracker.g.call', 'Or call for free')}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: t('tracker.g.stateLine', 'Chief Minister’s helpline'), num: STATE_LINE },
                  path === 'fee' ? { label: t('tracker.g.cscLine', 'CSC helpline'), num: CSC_LINE } : schemeLine ? { label: t('tracker.g.schemeLine', 'Scheme helpline'), num: schemeLine } : null,
                ]
                  .filter(Boolean)
                  .map((l) => (
                    <li key={l!.num}>
                      <a href={`tel:${l!.num.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 p-3 min-h-[56px] rounded-md bg-surface shadow-hair hover:shadow-lift transition-shadow">
                        <span className="w-10 h-10 rounded-full bg-patti-tint text-patti grid place-items-center shrink-0">
                          <Phone size={20} weight="fill" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-micro text-ink-3 truncate">{l!.label}</span>
                          <span className="block font-semibold num">{l!.num}</span>
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
};

export default GrievanceGuidanceModal;
