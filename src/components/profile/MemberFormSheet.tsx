import React, { useEffect, useState } from 'react';
import type { UserProfile } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { TextField, SelectField } from '../../ui/Field';
import { Segmented } from '../../ui/Chip';

type Draft = Omit<UserProfile, 'id'>;

const BLANK: Draft = {
  name: '',
  relation: 'child',
  age: 18,
  gender: 'female',
  occupation: 'student',
  state: 'Karnataka',
  district: 'Mandya',
  socialCategory: 'obc',
  landholdingAcres: 0,
  annualIncome: 0,
  isAadhaarLinkedBank: false,
  isDigiLockerLinked: false,
};

const RELATIONS: UserProfile['relation'][] = ['self', 'father', 'mother', 'spouse', 'child', 'other'];
const OCCUPATIONS = ['farmer', 'student', 'street_vendor', 'daily_wage', 'homemaker', 'artisan', 'other'];

/** Add / edit a household member. Only the fields that change eligibility are asked. */
export function MemberFormSheet({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial?: UserProfile; onSave: (d: Draft) => void }) {
  const { t } = useTranslation();
  const [d, setD] = useState<Draft>(BLANK);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setD(initial ? { ...initial } : BLANK);
      setTouched(false);
    }
  }, [open, initial]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const nameErr = touched && !d.name.trim() ? t('tracker.p.nameErr', 'Please enter a name') : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!d.name.trim()) return;
    onSave({ ...d, name: d.name.trim() });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? t('tracker.p.editTitle', 'Edit details') : t('tracker.p.addTitle', 'Add a family member')}
      closeLabel={t('navClose', 'Close')}
      desktop="side"
      size="md"
    >
      <form id="member-form" onSubmit={submit} className="space-y-5 pt-1" noValidate>
        <TextField label={t('tracker.p.name', 'Name')} placeholder={t('tracker.p.namePh')} value={d.name} onChange={(e) => set('name', e.target.value)} error={nameErr} autoComplete="name" data-autofocus />
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          <SelectField label={t('tracker.p.relation', 'Relation to you')} value={d.relation} onChange={(e) => set('relation', e.target.value as UserProfile['relation'])}>
            {RELATIONS.map((r) => (
              <option key={r} value={r}>
                {t(`tracker.p.rel.${r}`)}
              </option>
            ))}
          </SelectField>
          <TextField label={`${t('tracker.p.age', 'Age')} (${t('tracker.p.years', 'years')})`} type="number" inputMode="numeric" min={0} max={120} value={d.age} onChange={(e) => set('age', Math.max(0, Math.min(120, Number(e.target.value) || 0)))} className="num" />
        </div>
        <div>
          <p className="text-small font-semibold mb-1.5">{t('tracker.p.gender', 'Gender')}</p>
          <Segmented
            value={d.gender}
            onChange={(v) => set('gender', v)}
            label={t('tracker.p.gender', 'Gender')}
            layoutKey="member-gender"
            className="w-full"
            options={[
              { value: 'female', label: t('tracker.p.gender.female', 'Female') },
              { value: 'male', label: t('tracker.p.gender.male', 'Male') },
              { value: 'other', label: t('tracker.p.gender.other', 'Other') },
            ]}
          />
        </div>
        <SelectField label={t('tracker.p.occupation', 'Work')} value={d.occupation} onChange={(e) => set('occupation', e.target.value)}>
          {OCCUPATIONS.map((o) => (
            <option key={o} value={o}>
              {t(`tracker.p.occ.${o}`)}
            </option>
          ))}
        </SelectField>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          <TextField label={t('tracker.p.income', 'Yearly family income (₹)')} type="number" inputMode="numeric" min={0} value={d.annualIncome} onChange={(e) => set('annualIncome', Math.max(0, Number(e.target.value) || 0))} className="num" />
          <TextField label={t('tracker.p.land', 'Land owned (acres)')} type="number" inputMode="decimal" min={0} step={0.1} value={d.landholdingAcres} onChange={(e) => set('landholdingAcres', Math.max(0, Number(e.target.value) || 0))} className="num" />
        </div>
        <TextField label={t('tracker.p.district', 'District')} value={d.district} onChange={(e) => set('district', e.target.value)} />
        <Button type="submit" variant="solid" size="lg" block>
          {t('tracker.p.save', 'Save')}
        </Button>
      </form>
    </Sheet>
  );
}
