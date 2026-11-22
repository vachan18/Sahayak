import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Scheme } from '../types';
import { verifiedSchemes } from '../data/schemes';

export const fetchSchemesFromBackend = async (): Promise<{ schemes: Scheme[]; isFromDb: boolean; error?: string }> => {
  // Safe instant fallback if cloud credentials are not configured
  if (!isSupabaseConfigured()) {
    return {
      schemes: verifiedSchemes,
      isFromDb: false
    };
  }

  try {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error || !data || data.length === 0) {
      // Fallback to static verified catalog if table is empty or error occurs
      return {
        schemes: verifiedSchemes,
        isFromDb: false,
        error: error?.message
      };
    }

    // Map database rows to Scheme format, merging with frontend verified descriptors
    const mappedSchemes: Scheme[] = data.map((row) => {
      const fallback = verifiedSchemes.find(s => s.id === row.scheme_code || s.slug === row.scheme_code);
      if (fallback) {
        return {
          ...fallback,
          titleKey: row.name || fallback.titleKey,
          shortDescKey: row.description || fallback.shortDescKey,
          ministryKey: row.department || fallback.ministryKey
        };
      }

      // Default structure if new scheme was added to DB
      const benefitsData: any = row.benefits || {};
      return {
        id: row.scheme_code,
        slug: row.scheme_code,
        titleKey: row.name,
        shortDescKey: row.description,
        fullDescKey: row.description,
        lifeEventId: (row.category as any) || 'farming',
        ministryKey: row.department,
        benefitType: 'dbt_cash',
        benefitCategory: benefitsData.benefit_category || 'annual_cash_transfer',
        verificationStatus: 'VERIFIED',
        financialBenefit: {
          amount: benefitsData.amount || 0,
          frequencyKey: benefitsData.frequency || 'perYear',
          formattedDisplay: benefitsData.display || 'Direct Benefit'
        },
        statutoryFee: {
          amount: 0,
          isFree: true,
          statutoryRuleCitation: "Statutory Free Application (Official Portal)"
        },
        processingSlaDays: 21,
        sourceAttribution: row.official_url,
        lastVerifiedDate: "November 2026",
        handlingAuthorityKey: row.department,
        officialPortalUrl: row.official_url,
        helplinePhone: "1800-180-1551",
        eligibilityCriteria: {},
        keyBenefitsListKeys: [],
        whoIsEligibleListKeys: [],
        whoIsNotEligibleListKeys: [],
        documents: [
          {
            id: "aadhaar",
            nameKey: "Aadhaar Card",
            descriptionKey: "Identity verification proof",
            isMandatory: true,
            acceptableFormats: ["PDF", "JPEG"],
            maxSizeMb: 2,
            digiLockerSupported: true,
            status: "verified"
          }
        ]
      };
    });

    return {
      schemes: mappedSchemes,
      isFromDb: true
    };
  } catch (err: any) {
    return {
      schemes: verifiedSchemes,
      isFromDb: false,
      error: err.message
    };
  }
};

export const fetchSchemesFromDb = async (): Promise<Scheme[]> => {
  const result = await fetchSchemesFromBackend();
  return result.schemes;
};
