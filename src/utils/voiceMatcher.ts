import { EligibilityQuestion, QuestionOption } from '../types';

/**
 * Matches a spoken voice transcript to a question option.
 * Returns `null` when speech is empty, unclear, or unrecognized so the UI
 * never silently guesses `options[0]` and instead asks the citizen to choose manually.
 */
export function matchTranscriptToOption(
  transcript: string,
  question: Pick<EligibilityQuestion, 'fieldName' | 'options'>
): QuestionOption | null {
  // NFC so precomposed / decomposed Indic forms (e.g. Bengali–Assamese য় U+09DF vs য+়) compare equal
  const clean = transcript.toLowerCase().trim().normalize('NFC');
  const has = (w: string) => clean.includes(w.normalize('NFC'));
  if (!clean || !question.options || question.options.length === 0) return null;

  // 1. Direct match on labelKey or sublabelKey text
  for (const opt of question.options) {
    const label = (opt.labelKey || '').toLowerCase();
    const sublabel = (opt.sublabelKey || '').toLowerCase();
    if (clean.includes(label) || (label.length > 2 && label.includes(clean))) return opt;
    if (sublabel && (clean.includes(sublabel) || (sublabel.length > 2 && sublabel.includes(clean)))) return opt;
  }

  // 2. Vernacular keyword intent matching per field
  if (question.fieldName === 'occupation') {
    if (
      ['farmer', 'farm', 'ರೈತ', 'ಕೃಷಿ', 'किसान', 'কৃষক', 'খেতিয়ক', 'விவசாயி', 'రైతు', 'शेतकरी', 'കർഷകൻ', 'ખેડૂત', 'ଚାଷୀ', 'ਕਿਸਾਨ', 'کسان', 'کھیتی'].some((w) =>
        has(w)
      )
    ) {
      return question.options.find((o) => o.value === 'farmer') || null;
    }
    if (
      ['vendor', 'street', 'hawker', 'ವ್ಯಾಪಾರ', 'दुकान', 'फेरीवाला', 'ব্যবসায়ী', 'ফেৰিৱালা', 'বেপাৰী', 'விற்பனை', 'వ్యాపారి', 'കച്ചവട', 'ફેરિયા', 'ବେପାରୀ', 'ਰੇਹੜੀ', 'ٹھیلا', 'پھیری', 'دکان'].some((w) =>
        has(w)
      )
    ) {
      return question.options.find((o) => o.value === 'street_vendor') || null;
    }
    if (
      ['artisan', 'weaver', 'ಕುಶಲಕರ್ಮಿ', 'ಕಾರಿಗರ', 'ਕਾਰੀਗਰ', 'শিল্পী', 'তাঁতী', 'कारीगर', 'कारागीर', 'கைவினை', 'நெசவாளர்', 'చేతివృత్తి', 'చేనేత', 'കരകൗശല', 'કારીગર', 'କାରିଗର', 'کاریگر', 'بنکر'].some((w) =>
        has(w)
      )
    ) {
      return question.options.find((o) => o.value === 'artisan') || null;
    }
    if (
      ['student', 'college', 'ವಿದ್ಯಾರ್ಥಿ', 'छात्र', 'ছাত্র', 'ছাত্ৰ', 'மாணவர்', 'విద్యార్థి', 'विद्यार्थी', 'വിദ്യാർത്ഥി', 'વિદ્યાર્થી', 'ଛାତ୍ର', 'ਵਿਦਿਆਰਥੀ', 'طالب علم', 'کالج'].some((w) =>
        has(w)
      )
    ) {
      return question.options.find((o) => o.value === 'student') || null;
    }
  }

  // 3. Boolean questions across all 13 languages.
  // Negations first: Assamese "নহয়" (no) contains "হয়" (yes), so it must win.
  if (['নহয়', 'নাই', 'نہیں'].some((w) => has(w))) {
    const negative = question.options.find((o) => o.value === false);
    if (negative) return negative;
  }
  if (
    ['yes', 'ಹೌದು', 'हाँ', 'हां', 'হ্যাঁ', 'হয়', 'ஆம்', 'అవును', 'होय', 'അതെ', 'હા', 'ହଁ', 'ਹਾਂ', 'ہاں', 'جی', 'true'].some((w) =>
      has(w)
    )
  ) {
    return question.options.find((o) => o.value === true) || null;
  }
  if (
    ['no', 'ಇಲ್ಲ', 'नहीं', 'না', 'இல்லை', 'కాదు', 'లేదు', 'नाही', 'ഇല്ല', 'ના', 'ନା', 'ନାହିଁ', 'ਨਹੀਂ', 'false'].some((w) =>
      has(w)
    )
  ) {
    return question.options.find((o) => o.value === false) || null;
  }

  // 4. Numeric scales
  if (question.fieldName === 'landholdingAcres') {
    if (
      ['small', 'ಕಡಿಮೆ', 'कम', 'কম', 'குறைவு', 'తక్కువ', 'कमी', 'കുറവ്', 'ઓછી', 'କମ୍', 'ਘੱਟ', 'تھوڑی', 'کم', '1', '2'].some((w) => has(w))
    ) {
      return question.options.find((o) => o.value === 1.5) || null;
    }
  }
  if (question.fieldName === 'annualIncome') {
    if (
      ['bpl', 'low', 'ಕಡಿಮೆ', 'कम', 'লাখ', 'குறைவு', 'తక్కువ', 'कमी', 'കുറവ്', 'ઓછી', 'କମ୍', 'ਘੱਟ', 'غریب', 'کم'].some((w) => has(w))
    ) {
      return question.options.find((o) => o.value === 100000) || null;
    }
  }

  // Never fall back to options[0] — return null so citizen must choose manually
  return null;
}
