import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, CheckSquare, FolderArchive, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const BottomNavBar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: "/home", label: t('navHome', 'Discover'), icon: Compass },
    { to: "/eligibility", label: t('navEligibility', 'Eligibility'), icon: CheckSquare },
    { to: "/documents", label: t('navDocuments', 'Documents'), icon: FolderArchive },
    { to: "/tracker", label: t('navTracker', 'Tracker'), icon: Clock },
  ];

  return (
    <nav 
      aria-label="Primary mobile and tablet navigation dock" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-crisp-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-all relative min-h-[48px] py-1 px-1 ${
                  isActive
                    ? 'text-brand-navy-900 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-3 right-3 h-1 bg-amber-600 rounded-b-full shadow-sm animate-fadeIn" />
                  )}
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'scale-110 text-amber-600 dark:text-amber-400' : ''}`} />
                  <span className="text-[10px] sm:text-[11px] leading-tight tracking-tight line-clamp-1 max-w-full text-center px-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
