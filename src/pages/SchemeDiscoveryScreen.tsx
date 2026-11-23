import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, AlertCircle, X, ShieldCheck, 
  RotateCcw, Filter, 
  Wheat, HeartPulse, Users, GraduationCap, Store, Home, Landmark 
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { SchemeComparisonTray } from '../components/schemes/SchemeComparisonTray';

export const SchemeDiscoveryScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { schemes } = useAppStore();

  const selectedCategory = searchParams.get('category') || 'all';
  const urlQuery = searchParams.get('q') || '';

  const [searchKeyword, setSearchKeyword] = useState(urlQuery);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('all');
  const [selectedBenefitType, setSelectedBenefitType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'benefit_high' | 'sla_fast' | 'default'>('default');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state with URL search param if it changes externally
  useEffect(() => {
    setSearchKeyword(urlQuery);
  }, [urlQuery]);

  // Simulate smooth skeleton initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, []);

  const categories: { id: string; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', labelKey: 'filterAll', icon: Landmark },
    { id: 'farming', labelKey: 'lifeEvent_farming', icon: Wheat },
    { id: 'health_elder', labelKey: 'lifeEvent_health_elder', icon: HeartPulse },
    { id: 'women_child', labelKey: 'lifeEvent_women_child', icon: Users },
    { id: 'education_youth', labelKey: 'lifeEvent_education_youth', icon: GraduationCap },
    { id: 'business_artisan', labelKey: 'lifeEvent_business_artisan', icon: Store },
    { id: 'housing_utilities', labelKey: 'lifeEvent_housing_utilities', icon: Home }
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      // Category / Life Event Filter
      if (selectedCategory !== 'all' && s.lifeEventId !== selectedCategory) {
        return false;
      }

      // Jurisdiction Filter (Central vs State)
      if (selectedJurisdiction === 'central') {
        const isCentral = s.ministryKey.toLowerCase().includes('ministry') || 
                          s.ministryKey.toLowerCase().includes('national') || 
                          s.ministryKey.toLowerCase().includes('nabard');
        if (!isCentral) return false;
      } else if (selectedJurisdiction === 'state') {
        const isState = s.ministryKey.toLowerCase().includes('karnataka') || 
                        s.ministryKey.toLowerCase().includes('state');
        if (!isState && s.id !== 'pm-kisan') return false; // pm-kisan has joint state revenue linkage
      }

      // Beneficiary Type Filter
      if (selectedBeneficiary !== 'all') {
        const occ = s.eligibilityCriteria.occupations || [];
        const gender = s.eligibilityCriteria.genderAllowed || [];

        switch (selectedBeneficiary) {
          case 'farmer':
            if (!occ.includes('farmer') && !s.eligibilityCriteria.requiresLandTitle) return false;
            break;
          case 'women':
            if (!gender.includes('female') && !s.eligibilityCriteria.requiresMaternityStatus) return false;
            break;
          case 'student':
            if (!s.eligibilityCriteria.requiresStudentEnrollment) return false;
            break;
          case 'vendor':
            if (!occ.includes('street_vendor') && !s.eligibilityCriteria.requiresStreetVendorCertificate) return false;
            break;
          case 'bpl_senior':
            if (!s.eligibilityCriteria.requiresSeccOrBplRationCard && s.lifeEventId !== 'health_elder') return false;
            break;
          default:
            break;
        }
      }

      // Benefit Type Filter
      if (selectedBenefitType !== 'all' && s.benefitType !== selectedBenefitType) {
        return false;
      }

      // Text Search Query
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const title = s.titleKey.toLowerCase();
        const desc = s.shortDescKey.toLowerCase();
        const ministry = s.ministryKey.toLowerCase();
        const criteria = s.whoIsEligibleListKeys.join(' ').toLowerCase();
        return title.includes(q) || desc.includes(q) || ministry.includes(q) || criteria.includes(q);
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
  }, [schemes, selectedCategory, selectedJurisdiction, selectedBeneficiary, selectedBenefitType, searchKeyword, sortBy]);

  const handleCategorySelect = (catId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  const handleClearAllFilters = () => {
    setSearchKeyword('');
    setSelectedJurisdiction('all');
    setSelectedBeneficiary('all');
    setSelectedBenefitType('all');
    setSortBy('default');
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedJurisdiction !== 'all') count++;
    if (selectedBeneficiary !== 'all') count++;
    if (selectedBenefitType !== 'all') count++;
    if (searchKeyword.trim()) count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [selectedCategory, selectedJurisdiction, selectedBeneficiary, selectedBenefitType, searchKeyword, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Directory Title & Sovereign Trust Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-brand-navy-900/10 dark:bg-sky-950/60 text-brand-navy-900 dark:text-sky-300 border border-brand-navy-900/20 dark:border-sky-700/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>GAZETTE VERIFIED WELFARE DIRECTORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('catalogTitle', 'Government Schemes Directory')}
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore verified citizen welfare entitlements across Agriculture, Healthcare, Maternity, Education, and Credit with statutory ₹0 government application fees.
          </p>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="text-brand-navy-900 dark:text-sky-400 font-black">{filteredSchemes.length}</span> of {schemes.length} Schemes
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            ₹0 Statutory Govt Fee
          </div>
        </div>
      </div>

      {/* Search Bar & Primary Sort Strip */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by scheme name, keyword (e.g. Kisan, Hospital, Loan, Scholarship)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 shadow-crisp-sm min-h-[48px]"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select Control (>= 48px touch target) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto pl-4 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-amber-500/30 shadow-crisp-sm min-h-[48px] appearance-none cursor-pointer"
            >
              <option value="default">Sort: Recommended</option>
              <option value="benefit_high">Highest Benefit Amount</option>
              <option value="sla_fast">Fastest Approval (SLA)</option>
            </select>
            <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Horizontal Life-Event Category Chips Rail */}
      <div>
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 no-scrollbar overscroll-x-contain">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 min-h-[48px] flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-navy-900 dark:bg-sky-600 text-white shadow-crisp-sm ring-2 ring-brand-navy-900/30 dark:ring-sky-400/40'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <CatIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Multi-Dimensional Filter Bar (State, Beneficiary, Benefit Type) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Jurisdiction / State Filter */}
          <select
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[40px] cursor-pointer"
          >
            <option value="all">Jurisdiction: All (Central & State)</option>
            <option value="central">Central Sector / National (GoI)</option>
            <option value="state">State (Karnataka & State Portals)</option>
          </select>

          {/* Beneficiary Type Filter */}
          <select
            value={selectedBeneficiary}
            onChange={(e) => setSelectedBeneficiary(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[40px] cursor-pointer"
          >
            <option value="all">Beneficiary: All Types</option>
            <option value="farmer">Farmers & Cultivators</option>
            <option value="women">Women & Mothers</option>
            <option value="student">Students & Youth</option>
            <option value="vendor">Street Vendors & Artisans</option>
            <option value="bpl_senior">Low-Income / Senior Citizens</option>
          </select>

          {/* Benefit Type Filter */}
          <select
            value={selectedBenefitType}
            onChange={(e) => setSelectedBenefitType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[40px] cursor-pointer"
          >
            <option value="all">Benefit: All Types</option>
            <option value="dbt_cash">Direct Bank Transfer (DBT Cash)</option>
            <option value="health_insurance">Health Hospital Cover</option>
            <option value="credit_loan">Subsidized Working Capital</option>
            <option value="scholarship">Educational Scholarship</option>
          </select>
        </div>

        {/* Clear All Filters Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-colors min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Active Filter Tags Strip */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Applied:</span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
              <span>Category: {t(categories.find(c => c.id === selectedCategory)?.labelKey || '')}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleCategorySelect('all')} />
            </span>
          )}

          {selectedJurisdiction !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
              <span>Jurisdiction: {selectedJurisdiction === 'central' ? 'Central GoI' : 'State Karnataka'}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedJurisdiction('all')} />
            </span>
          )}

          {selectedBeneficiary !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
              <span>Beneficiary: {selectedBeneficiary}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedBeneficiary('all')} />
            </span>
          )}

          {selectedBenefitType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
              <span>Benefit: {selectedBenefitType}</span>
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedBenefitType('all')} />
            </span>
          )}

          {searchKeyword.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-semibold">
              <span>Search: "{searchKeyword}"</span>
              <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSearchKeyword('')} />
            </span>
          )}
        </div>
      )}

      {/* Skeleton Loading State or Scheme Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div key={sk} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="pt-4 flex gap-3">
                <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                <div className="h-12 w-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : (
        /* Empty State with Helpful Suggested Keywords & Reset Action */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-crisp-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('noSchemesFound', 'No schemes match your exact filter combination')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Try adjusting or resetting your filters, or explore these popular government welfare programs:
            </p>
          </div>

          {/* Suggested Keyword Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['Kisan', 'Ayushman', 'Maternity', 'Scholarship', 'Street Vendor'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchKeyword(term);
                  handleCategorySelect('all');
                  setSelectedJurisdiction('all');
                  setSelectedBeneficiary('all');
                  setSelectedBenefitType('all');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950 transition-colors"
              >
                + "{term}"
              </button>
            ))}
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-navy-900 dark:bg-sky-600 text-white font-black text-xs sm:text-sm shadow-crisp-sm hover:shadow-crisp-md transition-all min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters & View All Schemes</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Scheme Comparison Tray */}
      <SchemeComparisonTray />
    </div>
  );
};
