import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Heart, ShieldAlert, GraduationCap, Briefcase, Home, ArrowUpRight } from 'lucide-react';
import { lifeEventsData } from '../../data/lifeEvents';
import { useTranslation } from '../../hooks/useTranslation';

const iconMap: Record<string, React.ElementType> = {
  Wheat,
  HeartPulse: Heart,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Home
};

export const LifeEventGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
      {lifeEventsData.map((event) => {
        const IconComponent = iconMap[event.iconName] || Wheat;
        return (
          <Link
            key={event.id}
            to={`/schemes?category=${event.id}`}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-crisp-lg transition-all active:scale-98"
          >
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {t(event.titleKey)}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{event.schemeCount} {t('catalogTitle', 'Schemes')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};