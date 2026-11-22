import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mic, AlertTriangle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { LifeEventGrid } from '../components/dashboard/LifeEventGrid';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { AudioListenButton } from '../components/feedback/AudioListenButton';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schemes, setAiDrawerOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredSchemes = schemes.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero: Voice & Search Cockpit */}
      <section className="bg-gradient-to-b from-brand-navy-900 to-brand-navy-800 dark:from-slate-900 dark:to-slate-950 rounded-3xl p-5 sm:p-7 text-white shadow-crisp-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/15 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('sovereignMotto', 'Radical Dignity for Bharat')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-2">
            {t('tagline', 'Government Schemes in Your Language')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            {t('onboard2Desc', 'Discover welfare benefits, verify eligibility, and track applications with zero broker fees.')}
          </p>

          {/* Voice-First Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('heroVoiceSearchPrompt', 'Speak or type in your language...')}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-amber-500/40 shadow-inner"
            />
            <button
              type="button"
              onClick={() => setAiDrawerOpen(true)}
              className="absolute right-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{t('heroVoiceSearchCta', 'Speak')}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Urgent Seasonal Welfare Alert Banner */}
      <section aria-labelledby="seasonal-alert-heading">
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="seasonal-alert-heading" className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {t('urgentNoticeTitle', 'Seasonal Welfare Alert')}
              </h2>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed mt-0.5">
                {t('urgentNoticeDesc', 'Kharif crop assistance enrollment deadline is approaching. Ensure your land records are verified.')}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <AudioListenButton textToSpeak={`${t('urgentNoticeTitle')}. ${t('urgentNoticeDesc')}`} size="sm" />
          </div>
        </div>
      </section>

      {/* Quick 2-Minute Eligibility Checker Banner */}
      <section>
        <div className="bg-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-crisp-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              {t('eligibilityTitle', 'Smart Eligibility')}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              {t('resultsSubtitle', 'What is your family\'s total welfare entitlement?')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              {t('onboard2Desc', 'Answer 4 simple questions. Know your cash DBT, health cover, and loans instantly.')}
            </p>
          </div>
          <Link
            to="/eligibility"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm flex-shrink-0 active:scale-95 transition-all"
          >
            <span>{t('checkEligibilityBtn', 'Check My Eligibility')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Life-Event Exploration Grid ("Jeevan Ke Padav") */}
      <section aria-labelledby="life-events-heading">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 id="life-events-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              {t('lifeEventsTitle', 'Explore by Life Need')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('lifeEventsSubtitle', 'Select the stage that applies to your family right now')}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>{t('filterAll', 'All Schemes')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <LifeEventGrid />
      </section>

      {/* High-Impact Featured Government Schemes */}
      <section aria-labelledby="featured-schemes-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="featured-schemes-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              {t('catalogTitle', 'Government Schemes Directory')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('statutoryBadge', 'Official Sovereign Welfare Guide • 100% Free')}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-brand-navy-900 dark:text-sky-400 hover:underline flex items-center gap-1">
            <span>{t('viewDetailsBtn', 'View All')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>
    </div>
  );
};
