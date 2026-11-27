import { House, Compass, ListChecks, Files, Path, MapPin, type Icon } from '@phosphor-icons/react';

export interface NavItem {
  to: string;
  key: string;
  fallback: string;
  icon: Icon;
  /** Other path prefixes that should light this item up */
  match?: string[];
}

/** Desktop rail — the full information architecture. */
export const RAIL_ITEMS: NavItem[] = [
  { to: '/home', key: 'shell.nav.home', fallback: 'Home', icon: House },
  { to: '/schemes', key: 'shell.nav.schemes', fallback: 'Schemes', icon: Compass, match: ['/schemes'] },
  { to: '/eligibility', key: 'shell.nav.checkLong', fallback: 'Check eligibility', icon: ListChecks, match: ['/eligibility'] },
  { to: '/documents', key: 'shell.nav.papers', fallback: 'Papers', icon: Files, match: ['/documents'] },
  { to: '/tracker', key: 'shell.nav.track', fallback: 'Track', icon: Path, match: ['/tracker', '/guidance', '/csc-slip'] },
  { to: '/help-centres', key: 'shell.nav.helpCentres', fallback: 'Help centres', icon: MapPin, match: ['/help-centres'] },
];

/** Phone dock — four destinations around the central "Speak" button (thumb-zone IA). */
export const DOCK_LEFT: NavItem[] = [
  { to: '/home', key: 'shell.nav.home', fallback: 'Home', icon: House, match: ['/home', '/schemes'] },
  { to: '/eligibility', key: 'shell.nav.check', fallback: 'Check', icon: ListChecks, match: ['/eligibility'] },
];
export const DOCK_RIGHT: NavItem[] = [
  { to: '/documents', key: 'shell.nav.papers', fallback: 'Papers', icon: Files, match: ['/documents'] },
  { to: '/tracker', key: 'shell.nav.track', fallback: 'Track', icon: Path, match: ['/tracker', '/guidance', '/csc-slip'] },
];

/** Screens that are "tab roots" — they show the logo, not a back button, on phones. */
export const ROOT_PATHS = ['/', '/home', '/schemes', '/eligibility', '/documents', '/tracker', '/help-centres', '/profile', '/notifications'];

export function isActive(pathname: string, item: NavItem) {
  if (pathname === item.to) return true;
  return (item.match ?? []).some((m) => pathname === m || pathname.startsWith(`${m}/`));
}
