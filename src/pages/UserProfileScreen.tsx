import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PencilSimple, Check, ShieldCheck, TextAa, Translate, Bell, CaretRight, SignIn, SignOut, CloudCheck, ListChecks, Bank, IdentificationCard, LockKey } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { LANGUAGE_META } from '../data/languages';
import type { UserProfile } from '../types';
import { Avatar, displayName } from '../components/shell/FamilySwitcher';
import { MemberFormSheet } from '../components/profile/MemberFormSheet';
import { haptic } from '../lib/haptics';
import { PageHeader, SectionHeader, Button, Tag, Reveal, RevealItem, formatINR, cx } from '../ui';

function Fact({ icon, label, ok, t }: { icon: React.ReactNode; label: string; ok: boolean; t: (k: string, f?: string) => string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-micro', ok ? 'text-patti' : 'text-ink-3')}>
      {icon}
      {label}: <span className="font-semibold">{ok ? t('tracker.p.yes', 'Yes') : t('tracker.p.no', 'Not yet')}</span>
    </span>
  );
}

function MemberCard({ p, index, active, onSelect, onEdit }: { p: UserProfile; index: number; active: boolean; onSelect: () => void; onEdit: () => void }) {
  const { t } = useTranslation();
  return (
    <motion.article layout className={cx('relative h-full rounded-lg p-5 transition-shadow', active ? 'bg-surface shadow-lift ring-2 ring-neel' : 'bg-surface shadow-hair')}>
      <div className="flex items-start gap-4">
        <Avatar profile={p} index={index} size={52} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lead truncate">{displayName(p)}</h3>
          <p className="text-small text-ink-2">
            {t(`tracker.p.rel.${p.relation}`)} · <span className="num">{p.age}</span> {t('tracker.p.years', 'years')} · {t(`tracker.p.occ.${p.occupation}`, p.occupation)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        <Fact t={t} icon={<Bank size={14} />} label={t('tracker.p.bankLinked', 'Bank linked to Aadhaar')} ok={p.isAadhaarLinkedBank} />
        <Fact t={t} icon={<IdentificationCard size={14} />} label={t('tracker.p.digilocker', 'DigiLocker connected')} ok={p.isDigiLockerLinked} />
      </div>
      <div className="mt-5 flex items-center gap-2">
        {active ? (
          <span className="flex-1">
            <Tag tone="neel" icon={<Check size={12} weight="bold" />}>
              {t('tracker.p.active', 'Selected')}
            </Tag>
          </span>
        ) : (
          <Button variant="secondary" size="sm" onClick={onSelect} className="flex-1">
            {t('tracker.p.select', 'Check for this person')}
          </Button>
        )}
        <Button variant="ghost" size="sm" iconStart={<PencilSimple size={18} />} onClick={onEdit}>
          {t('tracker.p.edit', 'Edit')}
        </Button>
      </div>
    </motion.article>
  );
}

function SettingRow({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-4 px-5 py-4 min-h-[64px] text-start hover:bg-sunken/60 transition-colors">
      <span className="w-10 h-10 rounded-md bg-sunken text-ink-2 grid place-items-center shrink-0">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold">{title}</span>
        {sub && <span className="block text-small text-ink-2 truncate">{sub}</span>}
      </span>
      <CaretRight size={18} className="text-ink-3 flip-rtl" />
    </button>
  );
}

export const UserProfileScreen: React.FC = () => {
  const { t, language } = useTranslation();
  const { profiles, activeProfileId, setActiveProfileId, addProfile, updateProfile, authUser, openAuthModal, logoutUser, assessmentHistory, setComfortOpen, setLanguageSheetOpen, setNotificationsOpen, pushToast, notifications } = useAppStore();
  const [form, setForm] = useState<{ open: boolean; editing?: UserProfile }>({ open: false });
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHeader
        eyebrow={t('tracker.p.eyebrow', 'Your household')}
        title={t('tracker.p.title', 'Family')}
        description={t('tracker.p.subtitle')}
        actions={
          <Button variant="solid" iconStart={<Plus size={20} weight="bold" />} onClick={() => setForm({ open: true })}>
            {t('tracker.p.add', 'Add family member')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div className="min-w-0 space-y-10">
          <section aria-label={t('tracker.p.title', 'Family')}>
            <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((p, i) => (
                <RevealItem key={p.id}>
                  <MemberCard
                    p={p}
                    index={i}
                    active={p.id === activeProfileId}
                    onSelect={() => {
                      haptic('select');
                      setActiveProfileId(p.id);
                      pushToast({ message: `${t('tracker.p.checkingFor', 'Checking for')} ${displayName(p)}`, tone: 'neutral' });
                    }}
                    onEdit={() => setForm({ open: true, editing: p })}
                  />
                </RevealItem>
              ))}
              <RevealItem>
                <button type="button" onClick={() => setForm({ open: true })} className="w-full h-full min-h-[180px] rounded-lg border-2 border-dashed border-line-strong text-ink-2 hover:text-ink hover:border-ink-3 hover:bg-surface/60 transition-colors flex flex-col items-center justify-center gap-2 p-5">
                  <span className="w-12 h-12 rounded-full bg-sunken grid place-items-center">
                    <Plus size={24} weight="bold" />
                  </span>
                  <span className="font-semibold">{t('tracker.p.add', 'Add family member')}</span>
                  <span className="text-small text-ink-3 text-center">{t('tracker.p.addSub')}</span>
                </button>
              </RevealItem>
            </Reveal>
          </section>

          <section aria-labelledby="history">
            <SectionHeader id="history" title={t('tracker.p.history', 'Past eligibility checks')} />
            {assessmentHistory.length === 0 ? (
              <p className="p-5 rounded-lg border border-dashed border-line-strong text-ink-2">{t('tracker.p.historyEmpty')}</p>
            ) : (
              <ul className="rounded-lg bg-surface shadow-hair divide-y divide-line">
                {assessmentHistory.map((h) => (
                  <li key={h.id} className="flex items-center gap-4 p-4">
                    <span className="w-10 h-10 rounded-md bg-patti-tint text-patti grid place-items-center shrink-0">
                      <ListChecks size={20} weight="duotone" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{h.profileName ? h.profileName.split('(')[0].trim() : '—'}</p>
                      <p className="text-micro text-ink-3 num">{h.completedAt}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-semibold num">₹{formatINR(h.totalAnnualBenefitValue)}</p>
                      <p className="text-micro text-ink-3">
                        <span className="num">{h.eligibleCount}</span> {t('tracker.p.matched', 'schemes matched')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          {authUser ? (
            <section className="rounded-lg bg-surface shadow-hair p-5">
              <Tag tone="patti" icon={<CloudCheck size={14} weight="fill" />}>
                {t('tracker.p.signedIn', 'Signed in')}
              </Tag>
              <p className="mt-3 font-semibold truncate">{authUser.email ?? authUser.phone}</p>
              <p className="text-small text-ink-2 mt-1">{t('tracker.p.syncBody')}</p>
              <Button variant="secondary" size="sm" iconStart={<SignOut size={18} />} onClick={logoutUser} className="mt-4">
                {t('tracker.p.signOut', 'Sign out')}
              </Button>
            </section>
          ) : (
            <section className="rounded-lg bg-hero-neel text-on-hero p-6">
              <ShieldCheck size={32} weight="duotone" className="text-haldi" />
              <h2 className="mt-3 text-h3 font-semibold">{t('tracker.p.guestTitle', 'You are using Sahayak as a guest')}</h2>
              <p className="mt-1.5 text-small text-on-hero/80">{t('tracker.p.guestBody')}</p>
              <Button variant="primary" size="sm" iconStart={<SignIn size={18} />} onClick={() => openAuthModal('login')} className="mt-5">
                {t('tracker.p.signIn', 'Sign in')}
              </Button>
            </section>
          )}

          <section aria-labelledby="settings" className="rounded-lg bg-surface shadow-hair overflow-hidden">
            <h2 id="settings" className="px-5 pt-4 pb-1 text-small font-semibold text-ink-3">
              {t('tracker.p.settings', 'Settings')}
            </h2>
            <div className="divide-y divide-line">
              <SettingRow icon={<Translate size={20} />} title={t('tracker.p.language', 'Language')} sub={(LANGUAGE_META[language] || LANGUAGE_META.en).label} onClick={() => setLanguageSheetOpen(true)} />
              <SettingRow icon={<TextAa size={20} />} title={t('tracker.p.comfort', 'Reading comfort')} sub={t('tracker.p.comfortSub')} onClick={() => setComfortOpen(true)} />
              <SettingRow icon={<Bell size={20} />} title={t('tracker.p.alerts', 'Alerts')} sub={unread ? `${unread} ${t('tracker.n.unread', 'New')}` : undefined} onClick={() => setNotificationsOpen(true)} />
            </div>
          </section>

          <section className="rounded-lg bg-haldi-tint p-5 flex gap-3">
            <LockKey size={24} weight="duotone" className="text-haldi-deep shrink-0" />
            <div>
              <h2 className="font-semibold">{t('tracker.p.privacy', 'Your privacy')}</h2>
              <p className="text-small text-ink-2 mt-1">{t('tracker.p.privacyBody')}</p>
            </div>
          </section>
        </aside>
      </div>

      <MemberFormSheet
        open={form.open}
        initial={form.editing}
        onClose={() => setForm((f) => ({ ...f, open: false }))}
        onSave={(d) => {
          if (form.editing) {
            updateProfile(form.editing.id, d);
            pushToast({ message: t('tracker.p.updated', 'Details updated'), tone: 'success' });
          } else {
            addProfile(d);
            pushToast({ message: t('tracker.p.added', 'Family member added'), tone: 'success' });
          }
          haptic('success');
          setForm((f) => ({ ...f, open: false }));
        }}
      />
    </div>
  );
};

export default UserProfileScreen;
