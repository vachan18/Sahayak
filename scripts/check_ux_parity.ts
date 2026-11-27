/**
 * Checks Aangan redesign string parity for one or more languages.
 * Usage: npx vite-node scripts/check_ux_parity.ts hi mr
 * Reports missing keys, extra keys, empty values and values left identical to English.
 */
import { uxEn } from '../src/data/ux';

const langs = process.argv.slice(2);
const enKeys = Object.keys(uxEn);
let failed = false;

for (const lang of langs) {
  const mod = await import(`../src/data/ux/regional/${lang}.ts`);
  const dict: Record<string, string> = mod.default;
  const missing = enKeys.filter((k) => !(k in dict));
  const extra = Object.keys(dict).filter((k) => !(k in uxEn));
  const empty = Object.entries(dict).filter(([, v]) => !v || !String(v).trim()).map(([k]) => k);
  const same = enKeys.filter((k) => dict[k] === uxEn[k] && /[a-z]{4,}/i.test(uxEn[k]) && !/^[A-Z0-9 ()&./-]+$/.test(uxEn[k]));
  if (missing.length || extra.length || empty.length) failed = true;
  console.log(`\n[${lang}] ${Object.keys(dict).length}/${enKeys.length} keys · missing ${missing.length} · extra ${extra.length} · empty ${empty.length} · identical-to-English ${same.length}`);
  if (missing.length) console.log('  missing:', missing.slice(0, 40).join(' | '));
  if (extra.length) console.log('  extra:', extra.slice(0, 20).join(' | '));
  if (same.length) console.log('  identical (check these are proper nouns):', same.slice(0, 30).join(' | '));
}
process.exit(failed ? 1 : 0);
