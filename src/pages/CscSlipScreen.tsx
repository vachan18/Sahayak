import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, WhatsappLogo, Copy, Check, ChatCircleDots, MapPin, ArrowRight, Phone, Info } from '@phosphor-icons/react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { QrCodeSvg } from '../components/common/QrCodeSvg';
import { SahayakLogo } from '../components/common/SahayakLogo';
import { openWhatsApp } from '../lib/share';
import { PageHeader, Button, Surface, ListenButton, LifeGlyph, cx, ease } from '../ui';

export const CscSlipScreen = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { schemes, documentUploadStatus, applications, pushToast } = useAppStore();

  const app = tokenId ? applications.find((a) => a.tokenNumber === tokenId) : undefined;
  const schemeId = searchParams.get('scheme') ?? app?.schemeId;
  const scheme = schemes.find((s) => s.id === schemeId) || schemes[0];
  const token = tokenId || `KA-${scheme.id.toUpperCase()}-2026-84920`;
  const verifyUrl = `https://sahayak.gov.in/verify?token=${token}&scheme=${scheme.id}`;
  const schemeName = t(scheme.titleKey, scheme.titleKey);
  const shortName = schemeName.split('(')[0].trim();
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const script = [
    t('documents.slip.say1', 'Hello. I would like to apply for'),
    `${shortName}.`,
    t('documents.slip.say2', 'Here is my Sahayak slip and my papers.'),
    t('documents.slip.say3', 'The government fee is zero, and I will pay at most thirty rupees for your help.'),
    t('documents.slip.say4', 'Please give me the acknowledgement receipt.'),
  ].join(' ');

  const share = () => {
    openWhatsApp(`${t('documents.slip.shareText', 'My Sahayak help-centre slip')} — ${shortName}\n${t('documents.slip.token', 'Token')}: ${token}\n${t('documents.fee.govShort', 'Government fee')}: ₹0 · ${t('documents.fee.cscMax', 'Most a centre can charge')}: ₹30\n${verifyUrl}`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      pushToast({ message: t('shell.toast.copied', 'Copied'), tone: 'success' });
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow={t('documents.slip.eyebrow', 'Your slip is ready')}
        title={t('documents.slip.title', 'Take this to the help centre')}
        description={t('documents.slip.subtitle', 'Show it on your phone or print it. The operator scans the QR code and your details are filled in.')}
        actions={
          <>
            <Button onClick={() => window.print()} iconStart={<Printer size={20} weight="fill" />}>
              {t('documents.slip.print', 'Print or save PDF')}
            </Button>
            <Button variant="secondary" onClick={share} iconStart={<WhatsappLogo size={20} weight="fill" className="text-[#1C8D4E]" />}>
              WhatsApp
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-8 items-start">
        {/* ── The slip ── */}
        <motion.article
          initial={{ opacity: 0, y: 24, rotate: -0.6 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.5, ease: ease.out }}
          aria-label={t('documents.slip.aria', 'Help-centre slip')}
          className={cx(
            'print-sheet relative w-full max-w-[560px] rounded-xl bg-surface shadow-lift overflow-hidden',
            'print:max-w-[148mm] print:mx-auto print:rounded-none print:bg-white',
            'print:[&_*]:!text-black print:[&_*]:!shadow-none print:[&_*]:!bg-transparent'
          )}
        >
          {/* stub */}
          <div className="px-6 sm:px-8 pt-6 pb-5">
            <div className="flex items-center gap-3">
              <SahayakLogo className="h-10 w-auto" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">Sahayak</p>
                <p className="text-micro text-ink-3">{t('documents.slip.kind', 'Help-centre slip · Seva Kendra')}</p>
              </div>
              <p className="text-micro text-ink-3 num text-end">{date}</p>
            </div>

            <div className="mt-6">
              <p className="text-small text-ink-3">{t('documents.slip.token', 'Token')}</p>
              <div className="flex items-center gap-2">
                <p className="text-[1.5rem] xs:text-[1.75rem] sm:text-[2rem] leading-tight font-semibold num tracking-tight min-w-0" dir="ltr">{token}</p>
                <button type="button" onClick={copy} aria-label={t('documents.slip.copy', 'Copy token')} className="no-print w-10 h-10 shrink-0 grid place-items-center rounded-sm text-ink-3 hover:bg-sunken hover:text-ink">
                  <Copy size={20} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2.5 min-w-0">
                <LifeGlyph id={scheme.lifeEventId} size="sm" className="print:hidden" />
                <p className="font-semibold min-w-0">{schemeName}</p>
              </div>
            </div>
          </div>

          {/* perforation */}
          <div className="relative h-6" aria-hidden>
            <span className="absolute top-1/2 -start-3 w-6 h-6 -translate-y-1/2 rounded-full bg-paper print:hidden" />
            <span className="absolute top-1/2 -end-3 w-6 h-6 -translate-y-1/2 rounded-full bg-paper print:hidden" />
            <span className="absolute top-1/2 inset-x-5 border-t-2 border-dashed border-line-strong print:border-black" />
          </div>

          <div className="px-6 sm:px-8 pt-4 pb-7 space-y-6">
            <div className="grid grid-cols-1 xs:grid-cols-[auto_minmax(0,1fr)] gap-5 items-center">
              <QrCodeSvg value={verifyUrl} size={156} ariaLabel={`${t('documents.slip.qr', 'QR code for token')} ${token}`} className="shadow-hair mx-auto xs:mx-0 print:!bg-white" />
              <div className="min-w-0">
                <p className="font-semibold">{t('documents.slip.showOperator', 'Show this to the operator')}</p>
                <p className="mt-1 text-small text-ink-2">{t('documents.slip.showOperatorBody', 'They scan it to open your application with your details already filled in.')}</p>
                <dl className="mt-3 text-micro text-ink-3 space-y-0.5">
                  <div>
                    <dt className="inline">{t('documents.slip.office', 'Office')}: </dt>
                    <dd className="inline text-ink-2">{t(scheme.handlingAuthorityKey, scheme.handlingAuthorityKey)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">{t('documents.slip.papers', 'Papers to carry (originals too)')}</p>
              <ul className="space-y-1.5">
                {scheme.documents.map((d) => {
                  const s = documentUploadStatus[d.id] ?? d.status;
                  const ready = s === 'verified' || s === 'uploaded';
                  return (
                    <li key={d.id} className="flex items-center gap-3 min-h-[32px]">
                      <span className={cx('w-6 h-6 rounded-xs grid place-items-center shrink-0 border-2', ready ? 'bg-patti border-patti text-white' : 'border-line-strong', 'print:border-black')}>
                        {ready && <Check size={14} weight="bold" />}
                      </span>
                      <span className="text-small min-w-0">{t(d.nameKey, d.nameKey)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-md bg-haldi-tint p-4 print:border-2 print:border-black">
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-micro text-ink-2">{t('documents.fee.govShort', 'Government fee')}</dt>
                  <dd className="text-h2 font-semibold num-display text-patti">₹0</dd>
                </div>
                <div>
                  <dt className="text-micro text-ink-2">{t('documents.fee.cscMax', 'Most a centre can charge')}</dt>
                  <dd className="text-h2 font-semibold num-display">₹30</dd>
                </div>
              </dl>
              <p className="mt-2 text-small text-ink-2">{t('documents.slip.feeNote', 'Charging more is not allowed. Always ask for a receipt.')}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Phone size={14} className="print:hidden" />
                {t('documents.guidance.helpline', 'Helpline')}: <span className="num" dir="ltr">{scheme.helplinePhone}</span>
              </span>
              <span>{t('documents.slip.free', 'Sahayak is a free service')}</span>
            </div>
          </div>
        </motion.article>

        {/* ── Coaching panel (screen only) ── */}
        <div className="no-print space-y-4 min-w-0">
          <Surface padded="lg">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-md bg-neel-tint text-neel-ink grid place-items-center shrink-0">
                <ChatCircleDots size={24} weight="duotone" />
              </span>
              <div className="min-w-0">
                <h2 className="text-h3 font-semibold">{t('documents.slip.sayTitle', 'What to say at the counter')}</h2>
                <p className="text-small text-ink-2 mt-0.5">{t('documents.slip.sayHint', 'Read it, or play it out loud for the operator.')}</p>
              </div>
            </div>
            <blockquote className="mt-4 ps-4 border-s-4 border-haldi text-lead leading-body">{script}</blockquote>
            <div className="mt-5">
              <ListenButton text={script} label={t('documents.slip.playScript', 'Play out loud')} />
            </div>
          </Surface>

          <Link to="/help-centres" className="group flex items-center gap-4 rounded-lg bg-surface shadow-hair p-5 hover:shadow-lift transition-shadow">
            <span className="w-12 h-12 rounded-md bg-ghar-tint text-ghar grid place-items-center shrink-0">
              <MapPin size={26} weight="duotone" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-semibold">{t('documents.slip.findCentre', 'Find a centre that is open now')}</span>
              <span className="block text-small text-ink-2">{t('documents.slip.findCentreBody', 'With distance, timings and directions')}</span>
            </span>
            <ArrowRight size={20} className="text-ink-3 flip-rtl transition-transform group-hover:translate-x-0.5" />
          </Link>

          <p className="flex gap-2 text-small text-ink-2 px-1">
            <Info size={18} className="shrink-0 mt-0.5" />
            {t('documents.slip.pdfTip', 'Tip: in the print window choose “Save as PDF” to keep a copy on your phone.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CscSlipScreen;
