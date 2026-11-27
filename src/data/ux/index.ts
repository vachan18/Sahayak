import { shellEn } from './shell';
import { homeEn } from './home';
import { schemesEn } from './schemes';
import { eligibilityEn as eligibilityUxEn } from './eligibility';
import { documentsEn } from './documents';
import { trackerEn } from './tracker';
import { entryEn } from './entry';
import { contentEn } from './content';
import { contentDataEn } from './contentData';

/** All English strings introduced by the Aangan redesign. */
export const uxEn: Record<string, string> = {
  ...shellEn,
  ...homeEn,
  ...schemesEn,
  ...eligibilityUxEn,
  ...documentsEn,
  ...trackerEn,
  ...entryEn,
  ...contentEn,
  ...contentDataEn,
};
