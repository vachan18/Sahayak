import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Heart, ShieldAlert, GraduationCap, Briefcase, Home } from 'lucide-react';
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {lifeEventsData.map((event) => {
        const IconComponent = iconMap[event.iconName] || Wheat;
        return (
          <Link
            key={event.id}
            to={`/schemes?category=${event.id}`}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-crisp-md transition-all active:scale-98"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <IconComponent className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {t(event.titleKey)}
              </h4>
            </div>
            <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {event.schemeCount} {t('catalogTitle', 'Schemes')}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
