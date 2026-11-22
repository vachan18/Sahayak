import React, { useState } from 'react';
import { Users, Plus, Cloud, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';

export const UserProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { 
    profiles, 
    activeProfileId, 
    setActiveProfileId, 
    addProfile,
    authUser,
    openAuthModal,
    logoutUser 
  } = useAppStore();

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<'self' | 'father' | 'mother' | 'spouse' | 'child' | 'other'>('child');
  const [newMemberAge] = useState(20);
  const [newMemberOccupation] = useState('student');

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addProfile({
      name: newMemberName,
      relation: newMemberRelation,
      age: Number(newMemberAge),
      gender: newMemberRelation === 'mother' ? 'female' : 'male',
      occupation: newMemberOccupation,
      state: 'Karnataka',
      district: 'Mandya',
      socialCategory: 'obc',
      landholdingAcres: 0,
      annualIncome: 120000,
      isAadhaarLinkedBank: true,
      isDigiLockerLinked: true
    });

    setIsAddingMember(false);
    setNewMemberName('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 sm:py-6 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('profileTitle', 'Citizen & Family Profiles')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage profiles for your entire household to check welfare entitlements seamlessly.
        </p>
      </div>

      {/* Cloud Account & Sovereignty Status Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-crisp-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl ${authUser ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'}`}>
              {authUser ? <Cloud className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {authUser ? 'Cloud Sync Active (ಮೇಘ ಸಿಂಕ್ ಸಕ್ರಿಯ)' : 'Sovereign Guest Mode (ಅತಿಥಿ ಮೋಡ್)'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  authUser ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {authUser ? 'PostgreSQL RLS' : 'Local Only'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {authUser 
                  ? `Signed in as ${authUser.email}. Profile, bookmarks, and applications are securely backed up.`
                  : 'Operating locally without cloud sync. Sign in to access your data across kiosks or mobile devices.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {authUser ? (
              <button
                type="button"
                onClick={logoutUser}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800/50 active:scale-95 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out (ಲಾಗ್ ಔಟ್)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-navy-900 dark:bg-sky-600 hover:bg-brand-navy-800 dark:hover:bg-sky-500 shadow-crisp-xs active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Household Member Selector Switcher */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-crisp-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{t('householdMembers', 'Household Members')}</span>
          </h2>
          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addMemberBtn', 'Add Member')}</span>
          </button>
        </div>

        {/* Member Avatar Chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveProfileId(p.id)}
                className={`p-3 rounded-2xl border text-left min-w-[140px] flex-shrink-0 transition-all ${
                  isActive
                    ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-600'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="w-7 h-7 rounded-full bg-brand-navy-900 text-white text-xs font-bold flex items-center justify-center">
                    {p.name.charAt(0)}
                  </div>
                  {isActive && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">Active</span>}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{p.relation} • {p.occupation}</div>
              </button>
            );
          })}
        </div>

        {/* Add Member Form (Inline Collapse) */}
        {isAddingMember && (
          <form onSubmit={handleCreateMember} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Family Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Full Name (ಹೆಸರು)"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
              <select
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="child">Child (ಮಗ / ಮಗಳು)</option>
                <option value="father">Father (ತಂದೆ)</option>
                <option value="mother">Mother (ತಾಯಿ)</option>
                <option value="spouse">Spouse (ಪತ್ನಿ / ಪತಿ)</option>
              </select>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-amber-600 text-white font-bold text-xs"
            >
              Save Member Profile
            </button>
          </form>
        )}
      </section>

      {/* Active Profile Demographics */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-crisp-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {activeProfile.name}
            </h2>
            <div className="text-xs text-slate-500">
              {activeProfile.district}, {activeProfile.state}
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Aadhaar Linked ✓
          </span>
        </div>

        {/* Attribute Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Occupation</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">{activeProfile.occupation}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Landholding</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeProfile.landholdingAcres} Acres</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Social Category</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 uppercase mt-0.5">{activeProfile.socialCategory}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Age & Gender</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">{activeProfile.age} yrs • {activeProfile.gender}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-slate-400">Annual Income</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">₹{activeProfile.annualIncome.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
            <div className="text-blue-600 dark:text-blue-400 font-semibold">DigiLocker Sync</div>
            <div className="font-bold text-blue-900 dark:text-blue-200 mt-0.5">Connected ✓</div>
          </div>
        </div>
      </section>
    </div>
  );
};
