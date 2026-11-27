import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wheat, Heart, ShieldCheck, 
  GraduationCap, Briefcase, Home, ArrowUpRight 
} from 'lucide-react';
import { lifeEventsData } from '../../data/lifeEvents';
import { useTranslation } from '../../hooks/useTranslation';

const iconMap: Record<string, React.ElementType> = {
  Wheat,
  HeartPulse: Heart,
  ShieldAlert: ShieldCheck,
  GraduationCap,
  Briefcase,
  Home
};

export const LifeEventGrid: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      {lifeEventsData.map((event) => {
        const IconComponent = iconMap[event.iconName] || Wheat;
        return (
          <Link
            key={event.id}
            to={`/schemes?category=${event.id}`}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-crisp-md active:scale-[0.98] transition-all duration-150 min-h-[145px] sm:min-h-[165px]"
          >
            <div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2.5 sm:mb-3.5 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                {t(event.titleKey)}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 hidden sm:block">
                {t(event.descriptionKey)}
              </p>
            </div>

            <div className="mt-2.5 sm:mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="truncate">{event.schemeCount} {t('catalogTitle', 'Schemes')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};