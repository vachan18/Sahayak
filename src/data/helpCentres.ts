import type { SupportedLanguage } from '../types';

export type CentreType = 'gram_one' | 'csc' | 'seva_kendra' | 'post_office' | 'bank_mitra';
export type CentreService = 'aadhaar' | 'land' | 'certificates' | 'pmkisan' | 'pension' | 'bank' | 'health' | 'scholarship' | 'ration';

export interface HelpCentre {
  id: string;
  name: string;
  type: CentreType;
  address: string;
  distanceKm: number;
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  open: string; // HH:MM, 24h
  close: string; // HH:MM, 24h
  phone: string;
  services: CentreService[];
  languages: SupportedLanguage[];
  lat: number;
  lng: number;
}

/** Where the demo household lives (Mandya town) — used as "you are here" on the map. */
export const HOME_LOCATION = { lat: 12.5223, lng: 76.897 };

/**
 * Sample help centres around Mandya, Karnataka (matches the demo profile).
 * Demonstration data: names follow real centre types; phone numbers are placeholders.
 */
export const helpCentres: HelpCentre[] = [
  {
    id: 'mandya-gram-one',
    name: 'Mandya Gram One Centre',
    type: 'gram_one',
    address: 'Ward 12, near Sanjay Circle, Mandya 571401',
    distanceKm: 1.2,
    days: [1, 2, 3, 4, 5, 6],
    open: '09:00',
    close: '18:00',
    phone: '+91 80000 10001',
    services: ['aadhaar', 'land', 'pmkisan', 'pension', 'certificates'],
    languages: ['kn', 'en', 'hi'],
    lat: 12.5262,
    lng: 76.895,
  },
  {
    id: 'mandya-hpo',
    name: 'Mandya Head Post Office',
    type: 'post_office',
    address: 'VV Road, Mandya 571401',
    distanceKm: 1.8,
    days: [1, 2, 3, 4, 5, 6],
    open: '09:00',
    close: '17:00',
    phone: '+91 80000 10002',
    services: ['aadhaar', 'bank', 'pension'],
    languages: ['kn', 'hi', 'en'],
    lat: 12.5195,
    lng: 76.9045,
  },
  {
    id: 'guttal-csc',
    name: 'Common Service Centre, Guttal',
    type: 'csc',
    address: 'Main Road, Guttal Colony, Mandya 571403',
    distanceKm: 2.4,
    days: [0, 1, 2, 3, 4, 5, 6],
    open: '08:30',
    close: '19:30',
    phone: '+91 80000 10003',
    services: ['pmkisan', 'health', 'scholarship', 'ration', 'aadhaar'],
    languages: ['kn', 'en', 'ta'],
    lat: 12.5348,
    lng: 76.9121,
  },
  {
    id: 'mandya-nadakacheri',
    name: 'Nada Kacheri (Taluk Revenue Office)',
    type: 'seva_kendra',
    address: 'Mini Vidhana Soudha, Mandya 571401',
    distanceKm: 3.1,
    days: [1, 2, 3, 4, 5, 6],
    open: '10:00',
    close: '17:30',
    phone: '+91 80000 10004',
    services: ['certificates', 'land', 'ration'],
    languages: ['kn', 'en'],
    lat: 12.5087,
    lng: 76.8842,
  },
  {
    id: 'hosahalli-bank-mitra',
    name: 'Bank Mitra Point, Hosahalli',
    type: 'bank_mitra',
    address: 'Opp. Panchayat Office, Hosahalli 571402',
    distanceKm: 4.5,
    days: [1, 2, 3, 4, 5, 6],
    open: '10:00',
    close: '16:00',
    phone: '+91 80000 10005',
    services: ['bank', 'pension', 'pmkisan'],
    languages: ['kn', 'ur', 'hi'],
    lat: 12.5501,
    lng: 76.8711,
  },
  {
    id: 'srirangapatna-gram-one',
    name: 'Srirangapatna Gram One Centre',
    type: 'gram_one',
    address: 'Bus Stand Road, Srirangapatna 571438',
    distanceKm: 14.2,
    days: [1, 2, 3, 4, 5, 6],
    open: '09:00',
    close: '18:00',
    phone: '+91 80000 10006',
    services: ['aadhaar', 'land', 'certificates', 'health'],
    languages: ['kn', 'en', 'hi'],
    lat: 12.4216,
    lng: 76.6826,
  },
  {
    id: 'maddur-csc',
    name: 'Common Service Centre, Maddur',
    type: 'csc',
    address: 'NH 275, near Maddur Railway Station 571428',
    distanceKm: 19.0,
    days: [0, 1, 2, 3, 4, 5, 6],
    open: '09:00',
    close: '19:00',
    phone: '+91 80000 10007',
    services: ['pmkisan', 'scholarship', 'health', 'ration', 'aadhaar'],
    languages: ['kn', 'en', 'ta', 'te'],
    lat: 12.5847,
    lng: 77.0429,
  },
  {
    id: 'pandavapura-csc',
    name: 'Common Service Centre, Pandavapura',
    type: 'csc',
    address: 'Market Road, Pandavapura 571434',
    distanceKm: 24.3,
    days: [1, 2, 3, 4, 5, 6],
    open: '09:30',
    close: '18:30',
    phone: '+91 80000 10008',
    services: ['pmkisan', 'land', 'pension'],
    languages: ['kn'],
    lat: 12.4999,
    lng: 76.6731,
  },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function openState(c: HelpCentre, now = new Date()): { open: boolean; closesSoon: boolean } {
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = c.days.includes(now.getDay()) && mins >= toMinutes(c.open) && mins < toMinutes(c.close);
  return { open, closesSoon: open && toMinutes(c.close) - mins <= 45 };
}

/** "6 pm", "9:30 am" — localised via Intl (Kannada, Hindi, Urdu… all get native am/pm words). */
export function formatClock(hhmm: string, lang: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(2026, 0, 1, h, m);
  try {
    return d.toLocaleTimeString(`${lang}-IN`, { hour: 'numeric', minute: m ? '2-digit' : undefined });
  } catch {
    return hhmm;
  }
}

export const mapsUrl = (c: HelpCentre) => `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
