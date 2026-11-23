import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, FileText, ArrowRight, Phone, 
  ExternalLink, Share2, Bookmark, BookmarkCheck, ShieldCheck, 
  AlertTriangle, Building2, Check,
  Wheat, HeartPulse, Users, GraduationCap, Store, Home, Landmark
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { AudioListenButton } from '../components/feedback/AudioListenButton';
import { StatutoryFeeBadge } from '../components/feedback/StatutoryFeeBadge';
import { LifeEventId } from '../types';

export const SchemeDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { schemes, addRecentlyViewedScheme, savedSchemeIds, toggleSaveScheme } = useAppStore();
  const [copyFeedback, setCopyFeedback] = useState(false);

  const scheme = schemes.find(s => s.id === id);

  useEffect(() => {
    if (scheme?.id) {
      addRecentlyViewedScheme(scheme.id);
    }
  }, [scheme?.id, addRecentlyViewedScheme]);

  if (!scheme) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scheme Not Found</h2>
        <p className="text-xs text-slate-500">The requested welfare program is not available or has been updated.</p>
        <Link to="/schemes" className="text-amber-600 hover:underline text-sm font-semibold inline-flex items-center gap-1">
          <span>Return to Schemes Directory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isSaved = savedSchemeIds.includes(scheme.id);

  const audioFullSummary = `${scheme.titleKey}. ${scheme.shortDescKey}. Benefit: ${scheme.financialBenefit.formattedDisplay}. Expected approval in ${scheme.processingSlaDays} days. Official government fee is zero rupees.`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scheme.titleKey,
        text: scheme.shortDescKey,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const getCategoryMeta = (lifeEventId: LifeEventId) => {
    switch (lifeEventId) {
      case 'farming':
        return { label: t('lifeEvent_farming', 'Agriculture & Farming'), icon: Wheat };
      case 'health_elder':
        return { label: t('lifeEvent_health_elder', 'Health & Family'), icon: HeartPulse };
      case 'women_child':
        return { label: t('lifeEvent_women_child', 'Women & Child'), icon: Users };
      case 'education_youth':
        return { label: t('lifeEvent_education_youth', 'Education & Youth'), icon: GraduationCap };
      case 'business_artisan':
        return { label: t('lifeEvent_business_artisan', 'Micro-Enterprise & Credit'), icon: Store };
      case 'housing_utilities':
        return { label: t('lifeEvent_housing_utilities', 'Housing & Utilities'), icon: Home };
      default:
        return { label: 'Welfare Scheme', icon: Landmark };
    }
  };

  const categoryMeta = getCategoryMeta(scheme.lifeEventId);
  const CategoryIcon = categoryMeta.icon;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-24">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <Link to="/schemes" className="hover:text-slate-800 dark:hover:text-white transition-colors">
            Schemes
          </Link>
          <span className="text-slate-400">/</span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <CategoryIcon className="w-3 h-3 text-amber-600" />
            <span>{categoryMeta.label}</span>
          </span>
        </div>

        {/* Action Controls: Audio, Save, Share */}
        <div className="flex items-center gap-2">
          <AudioListenButton textToSpeak={audioFullSummary} label="Listen to Details (ಕೇಳಿ)" size="md" />

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isSaved ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700' : 'text-slate-600 dark:text-slate-300'
            }`}
            title={isSaved ? "Saved to your list (Click to remove)" : "Save scheme"}
            aria-label={isSaved ? "Remove from saved schemes" : "Save scheme for later"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center relative"
            title="Share with family or via WhatsApp"
            aria-label="Share scheme"
          >
            <Share2 className="w-4 h-4" />
            {copyFeedback && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Complete Statutory Dossier */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Header Title Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{scheme.ministryKey}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIALLY VERIFIED</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight break-words">
              {scheme.titleKey}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {scheme.shortDescKey}
            </p>
          </div>

          {/* Section 1: Overview & Simple Language Narrative */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>About the Scheme (ಯೋಜನೆಯ ವಿವರಣೆ)</span>
            </h2>
            <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
              <p>{scheme.fullDescKey}</p>
            </div>
            {/* Rules Registry Citation Pill */}
            {scheme.rulesRegistry && scheme.rulesRegistry.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">Statutory Citation:</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
                  {scheme.rulesRegistry[0].officialDocumentTitle} ({scheme.rulesRegistry[0].ruleId})
                </span>
              </div>
            )}
          </section>

          {/* Section 2: Key Benefits Explained in Simple Language */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <span>What You Receive (ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ?)</span>
            </h2>

            {/* Financial Highlight Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Official Benefit Entitlement
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums">
                {scheme.financialBenefit.formattedDisplay}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">
                Disbursed directly via National Automated Clearing House / PFMS to Aadhaar-linked account.
              </div>
            </div>

            <ul className="space-y-3 pt-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              {scheme.keyBenefitsListKeys.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: Who Can Apply & Exclusions (2-Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Who Can Apply */}
            <section className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 shadow-crisp-sm space-y-3">
              <h2 className="text-base font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Who Can Apply (ಯಾರು ಅರ್ಹರು?)</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {scheme.whoIsEligibleListKeys.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Who Cannot Apply (Exclusions) */}
            <section className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 shadow-crisp-sm space-y-3">
              <h2 className="text-base font-black text-rose-900 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Who Cannot Apply (ಯಾರಿಗೆ ಸಿಗುವುದಿಲ್ಲ?)</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {scheme.whoIsNotEligibleListKeys.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Section 4: Required Documents (Comprehensive Checklist) */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <span>Required Documents Checklist</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ensure all mandatory documents are available before initiating online or CSC application.
                </p>
              </div>
              <Link
                to={`/documents?scheme=${scheme.id}`}
                className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Inspect Correct Samples</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {scheme.documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {doc.nameKey}
                      </span>
                      {doc.digiLockerSupported && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                          <Check className="w-2.5 h-2.5" />
                          <span>DigiLocker Available</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {doc.descriptionKey}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                      <span>Formats: {doc.acceptableFormats.join(', ')}</span>
                      <span>•</span>
                      <span>Max size: {doc.maxSizeMb} MB</span>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-center flex-shrink-0 ${
                    doc.isMandatory
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {doc.isMandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Step-by-Step Application Process */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-sm space-y-5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Step-by-Step Application Process (ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Self-Service Online */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-navy-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Option A: Self-Online Application</span>
                </div>
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>Visit official portal at <strong className="text-brand-navy-900 dark:text-sky-400">{scheme.officialPortalUrl.replace('https://', '')}</strong>.</li>
                  <li>Click New Registration and authenticate with Aadhaar OTP.</li>
                  <li>Upload required documents (PDF/JPEG) or link via DigiLocker.</li>
                  <li>Submit application with <strong>₹0.00 Government Fee</strong> and save acknowledgment number.</li>
                </ol>
              </div>

              {/* Option B: Assisted Center (CSC / Grama One) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Option B: Assisted CSC / Grama One</span>
                </div>
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>Visit your local Grama One, Seva Sindhu, or CSC Kendra.</li>
                  <li>Provide Aadhaar and original documents for biometric eKYC.</li>
                  <li>The VLE operator uploads documents to the government portal.</li>
                  <li>Pay authorized facilitation fee (₹15 to ₹30 max); ₹0 govt fee. Collect printed receipt.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 6: Citizens' Charter & Statutory SLA Notice */}
          <section className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Citizens' Charter & Statutory SLA Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              By statutory administrative guidelines, your application must be verified and decided within <strong>{scheme.processingSlaDays} working days</strong> by the <strong>{scheme.handlingAuthorityKey}</strong>. If delayed beyond this SLA period without documented cause, you have the statutory right to escalate via CPGRAMS or Karnataka Sakala guarantee.
            </p>
          </section>
        </div>

        {/* Right Column (4 cols): Sticky Action Cockpit on Desktop */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          {/* Benefit Box & Quick Action Cockpit */}
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 shadow-crisp-md space-y-4">
            <div>
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                {t('directDbtBank', 'Direct Bank Transfer / Benefit')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-emerald-200 tabular-nums mt-1">
                {scheme.financialBenefit.formattedDisplay}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                Direct to NPCI Aadhaar-seeded bank account
              </div>
            </div>

            <StatutoryFeeBadge />

            {/* Source & Verified Notice */}
            <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Official Source: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{scheme.sourceAttribution}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 dark:text-slate-400">Last Verified: </span>
                <span>{scheme.lastVerifiedDate}</span>
              </div>
            </div>

            {/* Desktop Action Buttons (min 48px height) */}
            <div className="pt-2 space-y-2.5">
              <Link
                to={`/eligibility?scheme=${scheme.id}`}
                className="w-full py-4 px-4 rounded-2xl bg-brand-navy-900 hover:bg-brand-navy-800 text-white font-black text-sm text-center shadow-crisp-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <span>{t('checkEligibilityBtn', 'Check My Eligibility')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={`/guidance/${scheme.id}`}
                className="w-full py-4 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm text-center shadow-crisp-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
              >
                <span>{t('prepareDocumentsBtn', 'Apply Now / CSC Slip')}</span>
              </Link>
            </div>
          </div>

          {/* Official Helpline & Official Ministry Portal Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-crisp-sm space-y-3.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-500">Official Government Assistance</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <Phone className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Helpline: {scheme.helplinePhone}</span>
            </div>
            <div>
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-brand-navy-900 dark:text-sky-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
              >
                <span>Open Official Ministry Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Mobile Bottom Bar (Offset cleanly above BottomNavBar dock) */}
      <div 
        className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 shadow-crisp-xl"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 max-w-md mx-auto">
          <Link
            to={`/eligibility?scheme=${scheme.id}`}
            className="flex-1 py-3.5 px-3.5 sm:px-4 rounded-xl bg-brand-navy-900 dark:bg-sky-600 text-white font-bold text-xs sm:text-sm text-center shadow-sm flex items-center justify-center gap-1.5 min-h-[48px]"
          >
            <span className="truncate">{t('checkEligibilityBtn', 'Check Eligibility')}</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
          <Link
            to={`/guidance/${scheme.id}`}
            className="py-3.5 px-3.5 sm:px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm text-center shadow-sm whitespace-nowrap min-h-[48px] flex items-center justify-center flex-shrink-0"
          >
            {t('prepareDocumentsBtn', 'Apply Now')}
          </Link>
        </div>
      </div>
    </div>
  );
};
