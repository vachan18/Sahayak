import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface StatutoryFeeBadgeProps {
  isFree?: boolean;
  amount?: number;
  maxCscCharge?: number;
  className?: string;
}

export const StatutoryFeeBadge: React.FC<StatutoryFeeBadgeProps> = ({
  isFree = true,
  maxCscCharge = 30,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      <span>{t('statutoryFreeFee', 'Government Fee: ₹0.00 (Free)')}</span>
      <span className="text-emerald-600 dark:text-emerald-500 font-normal border-l border-emerald-300 dark:border-emerald-700 pl-1.5 ml-0.5">
        Max CSC: ₹{maxCscCharge}
      </span>
    </div>
  );
};
