import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface StatutoryFeeBadgeProps {
  maxCscCharge?: number;
  className?: string;
}

export const StatutoryFeeBadge: React.FC<StatutoryFeeBadgeProps> = ({
  maxCscCharge = 30,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
      <span>{t('statutoryFreeFee', 'Statutory Application Fee: ₹0.00 (No Official Fee)')}</span>
      <span className="text-emerald-700 dark:text-emerald-400 font-medium border-l border-emerald-300 dark:border-emerald-700 pl-1.5">
        Max CSC Fee: ₹{maxCscCharge}
      </span>
    </div>
  );
};
