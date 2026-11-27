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
  const clean = transcript.toLowerCase().trim();
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
      ['farmer', 'farm', 'ರೈತ', 'ಕೃಷಿ', 'किसान', 'কৃষক', 'விவசாயி', 'రైతు', 'शेतकरी', 'കർഷകൻ', 'ખેડૂત', 'ଚାଷୀ', 'ਕਿਸਾਨ'].some((w) =>
        clean.includes(w)
      )
    ) {
      return question.options.find((o) => o.value === 'farmer') || null;
    }
    if (
      ['vendor', 'street', 'ವ್ಯಾಪಾರ', 'दुकान', 'ব্যবসায়ী', 'விற்பனை', 'వ్యాపారి'].some((w) =>
        clean.includes(w)
      )
    ) {
      return question.options.find((o) => o.value === 'street_vendor') || null;
    }
    if (
      ['artisan', 'weaver', 'ಕುಶಲಕರ್ಮಿ', 'ಕಾರಿಗರ', 'ਕਾਰੀಗರ್', 'শিল্পী', 'कारीगर'].some((w) =>
        clean.includes(w)
      )
    ) {
      return question.options.find((o) => o.value === 'artisan') || null;
    }
    if (
      ['student', 'college', 'ವಿದ್ಯಾರ್ಥಿ', 'छात्र', 'ছাত্র', 'மாணவர்', 'విద్యార్థి', 'विद्यार्थी'].some((w) =>
        clean.includes(w)
      )
    ) {
      return question.options.find((o) => o.value === 'student') || null;
    }
  }

  // 3. Boolean questions across all 11 languages
  if (
    ['yes', 'ಹೌದು', 'हाँ', 'হ্যাঁ', 'ஆம்', 'అవును', 'होय', 'അതെ', 'હા', 'ହଁ', 'ਹਾਂ', 'true'].some((w) =>
      clean.includes(w)
    )
  ) {
    return question.options.find((o) => o.value === true) || null;
  }
  if (
    ['no', 'ಇಲ್ಲ', 'नहीं', 'না', 'இல்லை', 'కాదు', 'नाही', 'ഇല്ല', 'ના', 'ନା', 'ਨਹੀਂ', 'false'].some((w) =>
      clean.includes(w)
    )
  ) {
    return question.options.find((o) => o.value === false) || null;
  }

  // 4. Numeric scales
  if (question.fieldName === 'landholdingAcres') {
    if (
      ['small', 'ಕಡಿಮೆ', 'कम', 'কম', '1', '2'].some((w) => clean.includes(w))
    ) {
      return question.options.find((o) => o.value === 1.5) || null;
    }
  }
  if (question.fieldName === 'annualIncome') {
    if (
      ['bpl', 'low', 'ಕಡಿಮೆ', 'कम', 'লাখ'].some((w) => clean.includes(w))
    ) {
      return question.options.find((o) => o.value === 100000) || null;
    }
  }

  // Never fall back to options[0] — return null so citizen must choose manually
  return null;
}
