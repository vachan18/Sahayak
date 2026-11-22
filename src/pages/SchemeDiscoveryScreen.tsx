import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { LifeEventId } from '../types';

export const SchemeDiscoveryScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { schemes } = useAppStore();

  const selectedCategory = searchParams.get('category') || 'all';
  const urlQuery = searchParams.get('q') || '';

  const [searchKeyword, setSearchKeyword] = useState(urlQuery);
  const [selectedBenefitType, setSelectedBenefitType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'benefit_high' | 'sla_fast' | 'default'>('default');

  const categories: { id: string; labelKey: string }[] = [
    { id: 'all', labelKey: 'filterAll' },
    { id: 'farming', labelKey: 'lifeEvent_farming' },
    { id: 'women_child', labelKey: 'lifeEvent_women_child' },
    { id: 'health_elder', labelKey: 'lifeEvent_health_elder' },
    { id: 'education_youth', labelKey: 'lifeEvent_education_youth' },
    { id: 'business_artisan', labelKey: 'lifeEvent_business_artisan' },
    { id: 'housing_utilities', labelKey: 'lifeEvent_housing_utilities' }
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      // Category filter
      if (selectedCategory !== 'all' && s.lifeEventId !== selectedCategory) {
        return false;
      }
      // Benefit type filter
      if (selectedBenefitType !== 'all' && s.benefitType !== selectedBenefitType) {
        return false;
      }
      // Text search query
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const title = s.titleKey.toLowerCase();
        const desc = s.shortDescKey.toLowerCase();
        const ministry = s.ministryKey.toLowerCase();
        return title.includes(q) || desc.includes(q) || ministry.includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'benefit_high') {
        return b.financialBenefit.amount - a.financialBenefit.amount;
      }
      if (sortBy === 'sla_fast') {
        return a.processingSlaDays - b.processingSlaDays;
      }
      return 0;
    });
  }, [schemes, selectedCategory, selectedBenefitType, searchKeyword, sortBy]);

  const handleCategorySelect = (catId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedBenefitType('all');
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('catalogTitle', 'Government Schemes Directory')}
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400">
          {filteredSchemes.length} {t('catalogTitle', 'verified welfare schemes available with statutory zero government fees')}
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={t('navSearch', 'Search by scheme name, benefit, or keyword...')}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/40 shadow-crisp-sm"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-500/40 shadow-crisp-sm"
          >
            <option value="default">Sort: Recommended</option>
            <option value="benefit_high">Highest Benefit (DBT)</option>
            <option value="sla_fast">Fastest Approval (SLA)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Chips Rail */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-crisp-sm ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Active Filter Tags */}
      {(selectedCategory !== 'all' || searchKeyword) && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 font-medium">
              <span>{t(categories.find(c => c.id === selectedCategory)?.labelKey || '')}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategorySelect('all')} />
            </span>
          )}
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline ml-2"
          >
            {t('navReset', 'Clear All')}
          </button>
        </div>
      )}

      {/* Schemes Grid or Empty State */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('noSchemesFound', 'No schemes match your criteria')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try searching for broader keywords like "Kisan", "Loan", "Health", or reset your category filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors"
          >
            {t('navReset', 'Show All Schemes')}
          </button>
        </div>
      )}
    </div>
  );
};
