import { SupportedLanguage, Scheme } from '../types';
import { verifiedSchemes } from '../data/schemes';

export interface AssistantReply {
  text: string;
  actionLink?: {
    to: string;
    label: string;
  };
}

const KEYWORD_TO_SCHEME_ID: { keywords: string[]; schemeId: string }[] = [
  {
    keywords: ['kisan', 'pm-kisan', 'pm kisan', 'farmer', 'crop', 'ಕಿಸಾನ್', 'ರೈತ', 'किसान', 'কিসান', 'கிசான்', 'కిసాన్', 'किसान', 'കിസാൻ', 'કિસાન', 'କିସାନ', 'ਕਿਸਾਨ'],
    schemeId: 'pm-kisan',
  },
  {
    keywords: ['ayushman', 'pm-jay', 'pmjay', 'hospital', 'health', 'medical', 'ಆಯುಷ್ಮಾನ್', 'ಆರೋಗ್ಯ', 'आयुष्मान', 'स्वास्थ्य', 'আয়ুষ্মান', 'স্বাস্থ্য', 'ஆயுஷ்மான்', 'ఆయుష్మాన్', 'ആയുഷ്മാൻ', 'આયુષ્માન', 'ଆୟୁଷ୍ମାନ', 'ਆਯੁਸ਼ਮਾਨ'],
    schemeId: 'pm-jay',
  },
  {
    keywords: ['maternity', 'pregnant', 'mother', 'pmmvy', 'matru', 'ಗರ್ಭಿಣಿ', 'तாய್', 'मातृ', 'गर्भवती', 'মাতৃ', 'கர்ப்பிணி', 'గర్భిణి'],
    schemeId: 'pmmvy',
  },
  {
    keywords: ['svanidhi', 'vendor', 'street', 'hawker', 'ಲೋನ್', 'बैंक', 'ವ್ಯಾಪಾರ', 'विक्रेता', 'হকার', 'விற்பனை'],
    schemeId: 'pm-svanidhi',
  },
  {
    keywords: ['kcc', 'credit card', 'tenant', 'sharecropper', 'ಬೆಳೆ ಸಾಲ', 'केसीसी', 'ভুমিহীন'],
    schemeId: 'pm-kcc',
  },
  {
    keywords: ['scholarship', 'student', 'college', 'post-matric', 'ವಿದ್ಯಾರ್ಥಿ', 'छात्रवृत्ति', 'বৃত্তি', 'உதவித்தொகை', 'స్కాలర్'],
    schemeId: 'post-matric-scholarship',
  },
];

function findMatchingScheme(query: string): Scheme | undefined {
  const lower = query.toLowerCase();

  // 1. Direct keyword mapping
  for (const entry of KEYWORD_TO_SCHEME_ID) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      const found = verifiedSchemes.find((s) => s.id === entry.schemeId);
      if (found) return found;
    }
  }

  // 2. Fuzzy match against all verifiedSchemes titles, slugs, and life events
  return verifiedSchemes.find((s) => {
    const haystack = `${s.id} ${s.slug} ${s.titleKey} ${s.shortDescKey} ${s.lifeEventId}`.toLowerCase();
    return lower
      .split(/\s+/)
      .filter((w) => w.length >= 4)
      .some((word) => haystack.includes(word));
  });
}

export function buildAssistantReply(query: string, language: SupportedLanguage): AssistantReply {
  const clean = query.trim();
  const lower = clean.toLowerCase();

  // Check eligibility / assessment intent
  if (
    lower.includes('eligib') ||
    lower.includes('qualify') ||
    lower.includes('check') ||
    lower.includes('ಅರ್ಹ') ||
    lower.includes('पात्र') ||
    lower.includes('যোগ্য')
  ) {
    const text =
      language === 'kn'
        ? 'ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು 2 ನಿಮಿಷಗಳಲ್ಲಿ ಪರೀಕ್ಷಿಸಲು 4 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ ಪ್ರಾರಂಭಿಸಿ.'
        : language === 'hi'
        ? 'अपनी पात्रता 2 मिनट में जांचने के लिए 4 सरल सवालों के जवाब दें। नीचे दिए गए बटन से शुरू करें।'
        : language === 'bn'
        ? '২ মিনিটে আপনার যোগ্যতা যাচাই করতে ৪টি সহজ প্রশ্নের উত্তর দিন। নিচের বোতামে ট্যাপ করে শুরু করুন।'
        : 'Answer 4 plain-language questions to check your preliminary eligibility across all 12 verified schemes in under 2 minutes.';

    return {
      text,
      actionLink: { to: '/eligibility', label: 'Open Eligibility Checker' },
    };
  }

  // Check documents / passbook / DigiLocker intent
  if (
    lower.includes('document') ||
    lower.includes('aadhaar') ||
    lower.includes('passbook') ||
    lower.includes('digilocker') ||
    lower.includes('ದಾಖಲೆ') ||
    lower.includes('दस्तावेज') ||
    lower.includes('নথি')
  ) {
    const text =
      language === 'kn'
        ? 'ಸಾಮಾನ್ಯವಾಗಿ ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ (IFSC ಮತ್ತು ಸೀಲ್ ಸಹಿತ) ಹಾಗೂ ಆದಾಯ/ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಬೇಕಾಗುತ್ತದೆ. ದಾಖಲೆಗಳ ಪಟ್ಟಿಯನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.'
        : language === 'hi'
        ? 'आमतौर पर आधार कार्ड, बैंक पासबुक (IFSC और मुहर के साथ) और आय/जाति प्रमाणपत्र आवश्यक होते हैं। पूरी सूची नीचे देखें।'
        : language === 'bn'
        ? 'সাধারণত আধার কার্ড, ব্যাংক পাসবুক (IFSC ও স্ট্যাম্প সহ) এবং আয়/জাতিগত শংসাপত্র প্রয়োজন হয়। নিচে সম্পূর্ণ তালিকা দেখুন।'
        : 'Most schemes require Aadhaar, an Aadhaar-seeded Bank Passbook (clear front page with IFSC & bank seal), and Ration/Income certificates. Check your readiness below.';

    return {
      text,
      actionLink: { to: '/documents', label: 'Open Document Checklist' },
    };
  }

  // Check scheme match across all 12 verified schemes
  const matched = findMatchingScheme(clean);
  if (matched) {
    const docsList = matched.documents
      .slice(0, 3)
      .map((d) => d.nameKey)
      .join(', ');

    if (matched.id === 'pm-kisan' && language === 'kn') {
      return {
        text: 'ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಯಡಿ ವರ್ಷಕ್ಕೆ ₹6,000 ಹಣವನ್ನು 3 ಕಂತುಗಳಲ್ಲಿ (₹2,000 ಪ್ರತಿ 4 ತಿಂಗಳಿಗೆ) ನೇರವಾಗಿ ರೈತರ ಆಧಾರ್ ಲಿಂಕ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ. ಸರ್ಕಾರಿ ಶುಲ್ಕ ₹0.00.',
        actionLink: { to: `/schemes/${matched.id}`, label: 'View PM-KISAN Details' },
      };
    }
    if (matched.id === 'pm-kisan' && language === 'hi') {
      return {
        text: 'पीएम-किसान योजना के अंतर्गत ₹6,000 प्रति वर्ष तीन किस्तों (₹2,000 प्रत्येक) में सीधे आधार-सीडेड बैंक खाते में भेजे जाते हैं। सरकारी आवेदन शुल्क ₹0.00 है।',
        actionLink: { to: `/schemes/${matched.id}`, label: 'View PM-KISAN Details' },
      };
    }
    if (matched.id === 'pm-kisan' && language === 'bn') {
      return {
        text: 'পিএম-কিসান প্রকল্পের আওতায় বছরে ₹৬,০০০ টাকা ৩টি কিস্তিতে (প্রতি ৪ মাসে ₹২,০০০) সরাসরি আধার-লিঙ্কড ব্যাংক অ্যাকাউন্টে পাঠানো হয়। সরকারি ফি ₹০.০০।',
        actionLink: { to: `/schemes/${matched.id}`, label: 'View PM-KISAN Details' },
      };
    }

    return {
      text: `${matched.titleKey}: ${matched.shortDescKey} Benefit: ${matched.financialBenefit.formattedDisplay}. Key documents: ${docsList}. Official government fee: ₹${matched.statutoryFee.amount}.`,
      actionLink: { to: `/schemes/${matched.id}`, label: `View ${matched.id.toUpperCase()} Details` },
    };
  }

  // Default statutory fallback
  const fallbackText =
    language === 'kn'
      ? 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ನಿಯಮಗಳ ಪ್ರಕಾರ ಎಲ್ಲಾ ಯೋಜನೆಗಳಿಗೆ ಆಧಾರ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ ಜೋಡಣೆ ಕಡ್ಡಾಯವಾಗಿದೆ. ಸರ್ಕಾರಿ ಅರ್ಜಿ ಶುಲ್ಕ ₹0.00. ಕೆಳಗಿನಿಂದ ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ.'
      : language === 'hi'
      ? 'सरकारी नियमों के अनुसार योजनाओं के लिए आधार और बैंक खाता लिंक होना आवश्यक है। सरकारी आवेदन शुल्क ₹0.00 है। नीचे सभी योजनाएं देखें।'
      : language === 'bn'
      ? 'সরকারি নিয়ম অনুযায়ী কল্যাণমূলক প্রকল্পের জন্য আধার ও ব্যাংক অ্যাকাউন্ট লিঙ্ক থাকা প্রয়োজন। সরকারি ফি ₹০.০০। নিচে সব প্রকল্প দেখুন।'
      : 'Under official government guidelines, schemes require an Aadhaar-seeded bank account and carry ₹0.00 government fee (CSC convenience fee capped at ₹30). Ask about any scheme like PM-KISAN, Ayushman Bharat, KCC, or Scholarships.';

  return {
    text: fallbackText,
    actionLink: { to: '/schemes', label: 'Browse All 12 Schemes' },
  };
}
