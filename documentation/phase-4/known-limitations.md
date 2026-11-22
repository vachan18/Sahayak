# SAHAYAK (सहायक / ಸಹಾಯಕ)
## Known Limitations & Production Roadmap
### Project: PIXEL THEORY | Product: SAHAYAK | Phase 4 Deliverable

---

## 1. Architectural Boundaries in Phase 4

In strict compliance with competition constraints, Phase 4 focuses on a self-contained, high-fidelity frontend prototype with mock services and simulated state persistence before live cloud backend integrations in Phase 5.

```
+-------------------------------------------------------------------------------------------------------------------------+
| Dimension                    | Current Phase 4 Implementation               | Planned Phase 5 Integration               |
+-------------------------------------------------------------------------------------------------------------------------+
| Data Persistence             | Local Zustand Store & Browser Session        | Supabase PostgreSQL with Row Level        |
|                              | (Encrypted in client cache)                  | Security (RLS) & Offline Sync             |
+-------------------------------------------------------------------------------------------------------------------------+
| Voice Recognition & ASR      | Web Speech API & Simulated Intent Engine     | Sovereign Bhashini REST API (ASR + NMT)   |
|                              | (Client-side speech synthesis)               | pipeline for 22 scheduled languages       |
+-------------------------------------------------------------------------------------------------------------------------+
| Document Optical Pre-check   | On-device blur simulation & format validation| Tesseract OCR & OpenCV Edge Detection     |
|                              | for Bank Passbook / Land Record              | model running in WebAssembly worker       |
+-------------------------------------------------------------------------------------------------------------------------+
| Sovereign Credentials        | Simulated 1-Tap DigiLocker Consent Handshake | Official MeitY DigiLocker OAuth2 Gateway  |
|                              | with authentic verifiable badges             | returning signed XML/PDF credentials      |
+-------------------------------------------------------------------------------------------------------------------------+
| Grievance Redressal          | Deep-link redirect to CPGRAMS portal         | National CPGRAMS API auto-docketing       |
|                              | with pre-filled case particulars             | with tracking token synchronization       |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Responsible AI & Legal Disclaimers

1. **Simulation Notice**:
   - SAHAYAK explicitly displays demonstration notices on all application submission screens: *"Demonstration Mode: This simulates submission guidance and generates an authentic token. It does not file a real live legal affidavit."*
2. **Strict Non-Fabrication of Schemes**:
   - All schemes (PM-KISAN, PM-JAY, PMMVY, PM SVANidhi, Post-Matric Scholarship, KCC) are grounded directly in published Government of India gazette criteria, verified funding amounts, and official statutory Citizens' Charter SLAs.
