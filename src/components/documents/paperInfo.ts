import {
  IdentificationCard,
  Bank,
  Plant,
  Certificate,
  Receipt,
  GraduationCap,
  BabyCarriage,
  Storefront,
  Users,
  FileText,
  type Icon,
} from '@phosphor-icons/react';
import type { Tone } from '../../ui/Surface';
import type { DocumentSpec, Scheme } from '../../types';

export type SampleKind = 'passbook' | 'land' | 'id' | 'certificate';

export interface PaperInfo {
  icon: Icon;
  tone: Tone;
  sample: SampleKind;
  /** Plain-language reason this paper is asked for */
  whyKey: string;
  why: string;
  /** The mistake that most often gets this paper rejected */
  mistakeKey: string;
  mistake: string;
}

const BASE: Record<string, PaperInfo> = {
  aadhaar: {
    icon: IdentificationCard, tone: 'neel', sample: 'id',
    whyKey: 'documents.why.aadhaar', why: 'Proves who you are, and links the money to your bank account.',
    mistakeKey: 'documents.mistake.aadhaar', mistake: 'A blurry photo, or the QR code on the back cut off.',
  },
  bank_passbook: {
    icon: Bank, tone: 'ghar', sample: 'passbook',
    whyKey: 'documents.why.passbook', why: 'Shows the bank account where the government will send your money.',
    mistakeKey: 'documents.mistake.passbook', mistake: 'Photographing a transaction page instead of the front page, or glare hiding the IFSC code.',
  },
  land_record: {
    icon: Plant, tone: 'khet', sample: 'land',
    whyKey: 'documents.why.land', why: 'Shows that the farm land is in your name and how big it is.',
    mistakeKey: 'documents.mistake.land', mistake: 'An old copy, or a page where the survey number is cut off.',
  },
  caste_cert: {
    icon: Certificate, tone: 'vidya', sample: 'certificate',
    whyKey: 'documents.why.caste', why: 'Some schemes are reserved for SC, ST or OBC families.',
    mistakeKey: 'documents.mistake.caste', mistake: 'The certificate was issued for someone else in the family, not the applicant.',
  },
  income_cert: {
    icon: Receipt, tone: 'kaarigar', sample: 'certificate',
    whyKey: 'documents.why.income', why: 'Shows your family income is under the limit for this scheme.',
    mistakeKey: 'documents.mistake.income', mistake: 'The certificate is older than one year, or the Tahsildar seal is not visible.',
  },
  marksheet: {
    icon: GraduationCap, tone: 'vidya', sample: 'certificate',
    whyKey: 'documents.why.marksheet', why: 'Shows the class you passed and your marks.',
    mistakeKey: 'documents.mistake.marksheet', mistake: 'Only one side photographed, or the roll number is unreadable.',
  },
  mcp_card: {
    icon: BabyCarriage, tone: 'mamta', sample: 'certificate',
    whyKey: 'documents.why.mcp', why: 'The Mother and Child Protection card from your Anganwadi shows pregnancy check-ups.',
    mistakeKey: 'documents.mistake.mcp', mistake: 'The check-up dates page is missing.',
  },
  ration_card: {
    icon: Users, tone: 'sehat', sample: 'certificate',
    whyKey: 'documents.why.ration', why: 'Shows who lives in your family and your ration card type.',
    mistakeKey: 'documents.mistake.ration', mistake: 'The page listing family members is missing.',
  },
  cov_id: {
    icon: Storefront, tone: 'kaarigar', sample: 'id',
    whyKey: 'documents.why.vendor', why: 'Your street-vendor certificate or letter from the town council.',
    mistakeKey: 'documents.mistake.vendor', mistake: 'The certificate number or the issuing office stamp is not readable.',
  },
  minority_cert: {
    icon: Certificate, tone: 'vidya', sample: 'certificate',
    whyKey: 'documents.why.minority', why: 'Some scholarships are for students from minority communities.',
    mistakeKey: 'documents.mistake.minority', mistake: 'A self-declaration without the required signature.',
  },
};

const ALIASES: Record<string, string> = {
  aadhaar_couple: 'aadhaar',
  aadhaar_card: 'aadhaar',
  land_rtc: 'land_record',
  vending_certificate: 'cov_id',
  income_certificate: 'income_cert',
};

const FALLBACK: PaperInfo = {
  icon: FileText, tone: 'neutral', sample: 'certificate',
  whyKey: 'documents.why.default', why: 'The department asks for this paper to confirm your application.',
  mistakeKey: 'documents.mistake.default', mistake: 'A dark, blurry or cut-off photo.',
};

export function paperInfo(id: string): PaperInfo {
  return BASE[id] ?? BASE[ALIASES[id] ?? ''] ?? FALLBACK;
}

export type PaperState = 'ready' | 'attention' | 'todo';

export function paperState(status?: string): PaperState {
  if (status === 'verified' || status === 'uploaded') return 'ready';
  if (status === 'rejected') return 'attention';
  return 'todo';
}

export interface PaperRow {
  doc: DocumentSpec;
  schemes: Scheme[];
}

/** One row per paper, deduplicated across schemes, remembering which schemes need it. */
export function collectPapers(schemes: Scheme[]): PaperRow[] {
  const map = new Map<string, PaperRow>();
  schemes.forEach((s) =>
    s.documents.forEach((d) => {
      const row = map.get(d.id);
      if (row) {
        if (!row.schemes.includes(s)) row.schemes.push(s);
        row.doc = { ...row.doc, isMandatory: row.doc.isMandatory || d.isMandatory };
      } else {
        map.set(d.id, { doc: d, schemes: [s] });
      }
    })
  );
  return [...map.values()];
}
