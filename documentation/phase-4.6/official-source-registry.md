# Official Source Registry — Primary Statutory Citations

**Project:** PIXEL THEORY  
**Product:** SAHAYAK  
**Track:** DS-02 — Government Schemes in Your Language  
**Target:** `src/data/schemes.ts`, `src/types/index.ts`  

---

## 1. Registry Architecture

Every verified scheme in `src/data/schemes.ts` is equipped with a structured `rulesRegistry` adhering to the `SchemeEligibilityRule` schema:
```typescript
export interface SchemeEligibilityRule {
  ruleId: string;
  category: 'affirmative_inclusion' | 'statutory_exclusion' | 'verification_requirement';
  descriptionKey: string;
  officialGazetteClause: string;
  primarySourceUrl: string;
  verificationAuthority: string;
  lastAuditedDate: string;
}
```

---

## 2. Scheme-by-Scheme Primary Source Directory

### 2.1 PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
- **Ministry:** Ministry of Agriculture and Farmers Welfare (MoA&FW)
- **Primary Source:** Operational Guidelines for Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), Revised 31.05.2019.
- **Official Portal:** `https://pmkisan.gov.in`
- **Key Statutory Clauses:**
  - Clause 2: Small & Marginal Farmers Scheme expanded to all landholder farmers irrespective of land size (Cabinet Decision 31.05.2019).
  - Clause 2(a): Institutional Landholders Exclusion.
  - Clause 2(b)(i-ii): Constitutional Post Holders & Ministers Exclusion.
  - Clause 2(b)(iii): Government/PSU Employees Exclusion (Explicit Exemption for Class IV / Multi-Tasking Staff / Group D).
  - Clause 2(b)(iv): Superannuated Pensioners (Exclusion for monthly pension >= ₹10,000; Exemption for < ₹10,000).
  - Clause 2(b)(iv): Income-Tax Payee Exclusion in previous assessment year.
  - Clause 2(b)(v): Registered Professionals (Doctors, Engineers, Lawyers, CAs, Architects).

### 2.2 Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)
- **Ministry / Agency:** National Health Authority (NHA) & Ministry of Health and Family Welfare (MoHFW)
- **Primary Source:** NHA PM-JAY Operational Guidelines (2018, as amended); Gazette Notification S.O. 4668(E) dated 2024 (Ayushman Vay Vandana Card).
- **Official Portal:** `https://nha.gov.in` / `https://beneficiary.nha.gov.in`
- **Key Statutory Clauses:**
  - Section 3: Deprivation Criteria based on SECC 2011 (D1-D7 rural, 11 occupational categories urban).
  - S.O. 4668(E): Universal Senior Citizens (70+ years) Entitlement of ₹5.00 Lakh cover regardless of income.
  - State Convergence: NFSA BPL/PHH ration cards (Karnataka AB-ArK).

### 2.3 PMMVY (Pradhan Mantri Matru Vandana Yojana)
- **Ministry:** Ministry of Women and Child Development (MWCD)
- **Primary Source:** Mission Shakti Operational Guidelines (Samarthya Sub-Scheme, Section 3), Effective 01.04.2022.
- **Official Portal:** `https://pmmvy.wcd.gov.in`
- **Key Statutory Clauses:**
  - Section 3.1: Pathway 1 — First living child maternity benefit (₹5,000 in 2 installments upon ANC & immunization).
  - Section 3.1: Pathway 2 — Second girl child maternity benefit (₹6,000 in single installment upon birth & immunization to discourage female foeticide).
  - Section 3.1: Parity Cap — Benefits restricted to first two children.
  - Section 3.2: Exclusion of regular government/PSU employees receiving paid maternity leave.

### 2.4 PM SVANidhi (PM Street Vendor’s AtmaNirbhar Nidhi)
- **Ministry:** Ministry of Housing and Urban Affairs (MoHUA)
- **Primary Source:** PM SVANidhi Scheme Guidelines (June 2020, extended through December 2024).
- **Official Portal:** `https://pmsvanidhi.mohua.gov.in`
- **Key Statutory Clauses:**
  - Section 2.1: Target Group — Urban street vendors, hawkers, thelawalas. Artisans/craftsmen are covered under PM Vishwakarma, not SVANidhi.
  - Section 2.1: Certificate of Vending (CoV) / TVC Letter of Recommendation (LoR).
  - Section 3.1: Credit tranches (₹10k -> ₹20k -> ₹50k) with 7% interest subsidy DBT.

### 2.5 Kisan Credit Card (KCC)
- **Regulator / Ministry:** Reserve Bank of India (RBI) & Department of Financial Services (DFS)
- **Primary Source:** RBI Master Direction FIDD.CO.FSD.BC.No.12/05.05.010/2018-19.
- **Official Portal:** `https://rbi.org.in`
- **Key Statutory Clauses:**
  - Section 3: Broad Eligibility — Owner cultivators, tenant farmers, oral lessees, sharecroppers, SHGs/JLGs.
  - Land title is NOT mandatory for tenant farmers or sharecroppers.
  - Allied Activity Extension: Animal husbandry, dairy, and fisheries working capital credit up to ₹2.00 Lakh.

### 2.6 Post-Matric Scholarship for SC/ST/OBC Students
- **Ministry:** Ministry of Social Justice and Empowerment (MoSJE)
- **Primary Source:** Centrally Sponsored Scheme of Post-Matric Scholarships for SC/ST/OBC Guidelines (Clause 4).
- **Official Portal:** `https://scholarships.gov.in`
- **Key Statutory Clauses:**
  - Clause 4: SC, ST, OBC, EBC, DNT students enrolled in recognized post-matric institutions.
  - Clause 4.2: Annual family income ceiling of ₹2,50,000.

### 2.7 Post-Matric Scholarship for Minorities
- **Ministry:** Ministry of Minority Affairs (MoMA)
- **Primary Source:** MoMA Post-Matric Scholarship Operational Guidelines (Clause 3).
- **Official Portal:** `https://scholarships.gov.in`
- **Key Statutory Clauses:**
  - Clause 3: Notified minority communities under National Commission for Minorities Act, 1992.
  - Clause 3.2: Annual parental/family income ceiling of ₹2,00,000 (distinct from ₹2.5L SC ceiling).
  - Clause 3.1: Mandatory academic merit cut-off of minimum 50% marks in previous examination.
