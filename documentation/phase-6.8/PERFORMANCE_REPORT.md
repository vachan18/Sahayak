# SAHAYAK — Performance Engineering Report
**Phase:** 6.8 — Competition Polish  
**Focus:** Route-Level Code Splitting, Bundle Chunking & Asset Optimization  
**Auditor:** Senior Frontend Performance Engineer  

---

## 1. Executive Summary

Prior to Phase 6.8, all 14 screens and heavy third-party vendor dependencies (`framer-motion`, `@supabase/supabase-js`, `lucide-react`) were bundled into a single monolithic entry file (`index.js`). This triggered Vite's `>500 kB chunk size` warning, delayed First Contentful Paint (FCP), and increased memory footprint on budget rural smartphones.

In Phase 6.8:
- Implemented **route-level lazy loading** via `React.lazy()` and `<Suspense>` across all routes.
- Configured Vite `rollupOptions.output.manualChunks` to split vendor dependencies into 4 specialized caches.
- Achieved a **76.5% reduction** in the initial entry bundle payload.
- Accelerated production build speed by **27%** (from 11.02s to 7.97s).

---

## 2. Before vs After Bundle Comparison

| Metric / Asset | Before Phase 6.8 (Monolith) | After Phase 6.8 (Optimized) | Improvement |
|---|:---:|:---:|:---:|
| **Initial JS Entry Bundle** | **1,069.78 kB** (gzip: 280.17 kB) | **250.83 kB** (gzip: 62.47 kB) | **-76.5% (-818.95 kB)** ⚡ |
| **Vite Production Build Time** | 11.02 seconds | **7.97 seconds** | **+27.7% faster** ⚡ |
| **Chunk Warning (>500 kB)** | ⚠️ Triggered (`index.js > 500 kB`) | **0 Warnings (Clean)** | **100% Compliant** ✅ |
| **Vendor: Supabase (`@supabase/supabase-js`)** | Inlined in main bundle | 230.49 kB (gzip: 60.03 kB) | Isolated to async chunk |
| **Vendor: React Core (`react`, `react-dom`, `router`)** | Inlined in main bundle | 165.66 kB (gzip: 54.20 kB) | Long-term browser caching |
| **Vendor: Motion (`framer-motion`)** | Inlined in main bundle | 115.44 kB (gzip: 38.31 kB) | Isolated to async chunk |
| **Vendor: Icons (`lucide-react`)** | Inlined in main bundle | 34.69 kB (gzip: 6.57 kB) | Tree-shaken icon chunk |

---

## 3. Route Chunk Breakdown (Loaded on Demand)

| Screen / Feature | Chunk Size (Raw) | Gzip Size | Cache Strategy |
|---|:---:|:---:|---|
| `HomeScreen` | 41.51 kB | 9.38 kB | Preloaded on app start |
| `DocumentChecklistScreen` | 44.78 kB | 9.99 kB | On-demand route chunk |
| `EligibilityResultsScreen` | 33.48 kB | 8.37 kB | On-demand route chunk |
| `EligibilityCheckerScreen` | 25.36 kB | 7.85 kB | On-demand route chunk |
| `SchemeDiscoveryScreen` | 23.49 kB | 5.78 kB | On-demand route chunk |
| `SchemeDetailScreen` | 20.69 kB | 5.22 kB | On-demand route chunk |
| `ApplicationTrackerScreen` | 16.39 kB | 4.26 kB | On-demand route chunk |
| `ApplicationTrackerDetailScreen` | 14.24 kB | 4.01 kB | On-demand route chunk |
| `CscSlipScreen` | 11.00 kB | 4.14 kB | On-demand route chunk |
| `UserProfileScreen` | 9.12 kB | 2.69 kB | On-demand route chunk |
| `WelcomeScreen` | 6.90 kB | 1.91 kB | On-demand route chunk |
| `ApplicationGuidanceScreen` | 6.47 kB | 2.37 kB | On-demand route chunk |
| `LanguageSelectionScreen` | 4.27 kB | 1.83 kB | On-demand route chunk |
| `OnboardingScreen` | 3.25 kB | 1.45 kB | On-demand route chunk |
| `NotificationsScreen` | 2.53 kB | 1.01 kB | On-demand route chunk |

---

## 4. User Experience & Perceived Performance

1. **Zero-Layout Shift Skeleton Fallback:** Route transitions render an accessible loading spinner wrapped with `role="status"` and `aria-live="polite"`, preventing layout shifts.
2. **Reduced Motion Respect:** All Framer Motion animations automatically disable when the user's OS specifies `prefers-reduced-motion: reduce`.
3. **No Duplicate Component Renders:** Shared modals (DigiLocker simulation, Grievance guidance, Scheme comparison tray) are lazy-mounted inside parent layouts.
