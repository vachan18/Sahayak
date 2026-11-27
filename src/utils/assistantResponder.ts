import { SupportedLanguage, Scheme } from '../types';
import { verifiedSchemes } from '../data/schemes';
import { translations } from '../data/translations';

export interface AssistantReply {
  text: string;
  actionLink?: {
    to: string;
    label: string;
  };
}

/* ── Intent vocabulary (all 13 languages) ─────────────────────────────────── */

const KEYWORD_TO_SCHEME_ID: { keywords: string[]; schemeId: string }[] = [
  {
    keywords: ['kisan', 'pm-kisan', 'pm kisan', 'farmer', 'crop', 'ಕಿಸಾನ್', 'ರೈತ', 'किसान', 'কিসান', 'কিষাণ', 'খেতিয়ক', 'கிசான்', 'விவசாயி', 'కిసాన్', 'കിസാൻ', 'કિસાન', 'କିସାନ', 'ଚାଷୀ', 'ਕਿਸਾਨ', 'کسان'],
    schemeId: 'pm-kisan',
  },
  {
    keywords: ['ayushman', 'pm-jay', 'pmjay', 'hospital', 'health', 'medical', 'ಆಯುಷ್ಮಾನ್', 'ಆರೋಗ್ಯ', 'आयुष्मान', 'स्वास्थ्य', 'আয়ুষ্মান', 'স্বাস্থ্য', 'চিকিৎসালয়', 'ஆயுஷ்மான்', 'மருத்துவமனை', 'ఆయుష్మాన్', 'ఆసుపత్రి', 'ആയുഷ്മാൻ', 'ആശുപത്രി', 'આયુષ્માન', 'ହସ୍ପିଟାଲ', 'ଆୟୁଷ୍ମାନ', 'ਆਯੁਸ਼ਮਾਨ', 'ਹਸਪਤਾਲ', 'آیوشمان', 'اسپتال', 'علاج'],
    schemeId: 'pm-jay',
  },
  {
    keywords: ['maternity', 'pregnant', 'mother', 'pmmvy', 'matru', 'ಗರ್ಭಿಣಿ', 'मातृ', 'गर्भवती', 'মাতৃ', 'গৰ্ভৱতী', 'গর্ভবতী', 'தாய்', 'கர்ப்பிணி', 'గర్భిణి', 'ഗർഭിണി', 'સગર્ભા', 'ଗର୍ଭବତୀ', 'ਗਰਭਵਤੀ', 'حاملہ', 'زچگی'],
    schemeId: 'pmmvy',
  },
  {
    keywords: ['svanidhi', 'vendor', 'street', 'hawker', 'ವ್ಯಾಪಾರ', 'विक्रेता', 'फेरीवाला', 'হকার', 'ফেৰিৱালা', 'விற்பனை', 'వ్యాపారి', 'കച്ചവട', 'ફેરિયા', 'ବେପାରୀ', 'ਰੇਹੜੀ', 'ٹھیلا', 'پھیری'],
    schemeId: 'pm-svanidhi',
  },
  {
    keywords: ['kcc', 'credit card', 'tenant', 'sharecropper', 'ಬೆಳೆ ಸಾಲ', 'केसीसी', 'ভুমিহীন', 'আধিয়াৰ', 'فصلی قرض'],
    schemeId: 'pm-kcc',
  },
  {
    keywords: ['scholarship', 'student', 'college', 'post-matric', 'ವಿದ್ಯಾರ್ಥಿ', 'छात्रवृत्ति', 'शिष्यवृत्ती', 'বৃত্তি', 'உதவித்தொகை', 'స్కాలర్', 'സ്കോളർഷിപ്പ്', 'શિષ્યવૃત્તિ', 'ବୃତ୍ତି', 'ਵਜ਼ੀਫ਼ਾ', 'وظیفہ'],
    schemeId: 'post-matric-scholarship',
  },
];

const ELIGIBILITY_WORDS = ['eligib', 'qualify', 'check', 'ಅರ್ಹ', 'पात्र', 'যোগ্য', 'தகுதி', 'అర్హత', 'യോഗ്യത', 'પાત્ર', 'ଯୋଗ୍ୟ', 'ਯੋਗ', 'اہل'];
const DOCUMENT_WORDS = ['document', 'aadhaar', 'passbook', 'digilocker', 'ದಾಖಲೆ', 'दस्तावेज', 'कागद', 'কাগজ', 'নথি', 'ஆவண', 'పత్రా', 'രേഖ', 'દસ્તાવેજ', 'କାଗଜ', 'ਦਸਤਾਵੇਜ਼', 'کاغذ', 'دستاویز', 'آدھار'];

/* ── Reply phrasebook ─────────────────────────────────────────────────────── */

interface Phrases {
  eligibility: string;
  documents: string;
  fallback: string;
  /** Template for a matched scheme. {title} {amount} {freq} {fee} {docs} */
  scheme: string;
  openEligibility: string;
  openDocuments: string;
  viewScheme: string;
  browseAll: string;
}

const PHRASES: Record<SupportedLanguage, Phrases> = {
  en: {
    eligibility: 'Answer 4 plain-language questions to check your preliminary eligibility for every scheme in under 2 minutes.',
    documents: 'Most schemes need Aadhaar, an Aadhaar-linked bank passbook (clear front page with IFSC and bank seal), and a ration or income certificate. Check your readiness below.',
    fallback: 'Every scheme here needs an Aadhaar-linked bank account, and the government fee is ₹0 (a CSC may charge at most ₹30 for help). Ask about any scheme — PM-KISAN, Ayushman Bharat, KCC or scholarships.',
    scheme: '{title}: benefit {amount} {freq}. Key papers: {docs}. Government fee: ₹{fee}.',
    openEligibility: 'Open eligibility check',
    openDocuments: 'Open papers checklist',
    viewScheme: 'View scheme',
    browseAll: 'Browse all schemes',
  },
  kn: {
    eligibility: 'ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು 2 ನಿಮಿಷಗಳಲ್ಲಿ ಪರೀಕ್ಷಿಸಲು 4 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ ಪ್ರಾರಂಭಿಸಿ.',
    documents: 'ಸಾಮಾನ್ಯವಾಗಿ ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ (IFSC ಮತ್ತು ಸೀಲ್ ಸಹಿತ) ಹಾಗೂ ಆದಾಯ/ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಬೇಕಾಗುತ್ತದೆ. ದಾಖಲೆಗಳ ಪಟ್ಟಿಯನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    fallback: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳಿಗೆ ಆಧಾರ್ ಜೋಡಿತ ಬ್ಯಾಂಕ್ ಖಾತೆ ಕಡ್ಡಾಯ. ಸರ್ಕಾರಿ ಅರ್ಜಿ ಶುಲ್ಕ ₹0 (CSC ಗರಿಷ್ಠ ₹30 ಮಾತ್ರ). ಪಿಎಂ-ಕಿಸಾನ್, ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಮುಂತಾದ ಯಾವುದೇ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.',
    scheme: '{title}: ಸೌಲಭ್ಯ {amount} {freq}. ಮುಖ್ಯ ದಾಖಲೆಗಳು: {docs}. ಸರ್ಕಾರಿ ಶುಲ್ಕ: ₹{fee}.',
    openEligibility: 'ಅರ್ಹತೆ ಪರೀಕ್ಷೆ ತೆರೆಯಿರಿ',
    openDocuments: 'ದಾಖಲೆಗಳ ಪಟ್ಟಿ ತೆರೆಯಿರಿ',
    viewScheme: 'ಯೋಜನೆ ನೋಡಿ',
    browseAll: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು',
  },
  hi: {
    eligibility: 'अपनी पात्रता 2 मिनट में जांचने के लिए 4 सरल सवालों के जवाब दें। नीचे दिए गए बटन से शुरू करें।',
    documents: 'आमतौर पर आधार कार्ड, बैंक पासबुक (IFSC और मुहर के साथ) और आय/जाति प्रमाणपत्र चाहिए होते हैं। पूरी सूची नीचे देखें।',
    fallback: 'हर योजना के लिए आधार से जुड़ा बैंक खाता ज़रूरी है और सरकारी शुल्क ₹0 है (CSC अधिकतम ₹30 ले सकता है)। पीएम-किसान, आयुष्मान भारत जैसी किसी भी योजना के बारे में पूछें।',
    scheme: '{title}: लाभ {amount} {freq}। मुख्य कागज़ात: {docs}। सरकारी शुल्क: ₹{fee}।',
    openEligibility: 'पात्रता जांच खोलें',
    openDocuments: 'कागज़ात की सूची खोलें',
    viewScheme: 'योजना देखें',
    browseAll: 'सभी योजनाएं देखें',
  },
  bn: {
    eligibility: '২ মিনিটে আপনার যোগ্যতা যাচাই করতে ৪টি সহজ প্রশ্নের উত্তর দিন। নিচের বোতামে ট্যাপ করে শুরু করুন।',
    documents: 'সাধারণত আধার কার্ড, ব্যাংক পাসবুক (IFSC ও স্ট্যাম্প সহ) এবং আয়/জাতিগত শংসাপত্র প্রয়োজন হয়। নিচে সম্পূর্ণ তালিকা দেখুন।',
    fallback: 'প্রতিটি প্রকল্পের জন্য আধার-যুক্ত ব্যাংক অ্যাকাউন্ট দরকার, সরকারি ফি ₹0 (CSC সর্বোচ্চ ₹30 নিতে পারে)। পিএম-কিসান, আয়ুষ্মান ভারত সহ যেকোনো প্রকল্প নিয়ে জিজ্ঞাসা করুন।',
    scheme: '{title}: সুবিধা {amount} {freq}। প্রধান কাগজপত্র: {docs}। সরকারি ফি: ₹{fee}।',
    openEligibility: 'যোগ্যতা যাচাই খুলুন',
    openDocuments: 'কাগজপত্রের তালিকা খুলুন',
    viewScheme: 'প্রকল্প দেখুন',
    browseAll: 'সব প্রকল্প দেখুন',
  },
  ta: {
    eligibility: '2 நிமிடத்தில் உங்கள் தகுதியை அறிய 4 எளிய கேள்விகளுக்குப் பதில் சொல்லுங்கள். கீழே உள்ள பொத்தானைத் தொட்டுத் தொடங்குங்கள்.',
    documents: 'பெரும்பாலான திட்டங்களுக்கு ஆதார், ஆதார் இணைத்த வங்கிப் பாஸ்புக் (IFSC, வங்கி முத்திரையுடன்), ரேஷன் அல்லது வருமானச் சான்றிதழ் தேவை. கீழே உங்கள் தயார்நிலையைப் பாருங்கள்.',
    fallback: 'எல்லாத் திட்டங்களுக்கும் ஆதார் இணைத்த வங்கிக் கணக்கு தேவை, அரசுக் கட்டணம் ₹0 (CSC அதிகபட்சம் ₹30 மட்டுமே). PM-KISAN, ஆயுஷ்மான் பாரத் போன்ற எந்தத் திட்டம் பற்றியும் கேளுங்கள்.',
    scheme: '{title}: பலன் {amount} {freq}. முக்கிய ஆவணங்கள்: {docs}. அரசுக் கட்டணம்: ₹{fee}.',
    openEligibility: 'தகுதிச் சோதனையைத் திற',
    openDocuments: 'ஆவணப் பட்டியலைத் திற',
    viewScheme: 'திட்டத்தைப் பார்',
    browseAll: 'எல்லாத் திட்டங்களும்',
  },
  te: {
    eligibility: '2 నిమిషాల్లో మీ అర్హత తెలుసుకోవడానికి 4 సులభమైన ప్రశ్నలకు జవాబు ఇవ్వండి. కింది బటన్ నొక్కి మొదలుపెట్టండి.',
    documents: 'చాలా పథకాలకు ఆధార్, ఆధార్‌తో లింక్ అయిన బ్యాంకు పాస్‌బుక్ (IFSC, బ్యాంకు ముద్రతో), రేషన్ లేదా ఆదాయ ధృవీకరణ పత్రం అవసరం. కింద మీ సిద్ధతను చూడండి.',
    fallback: 'ప్రతి పథకానికి ఆధార్ లింక్ అయిన బ్యాంకు ఖాతా అవసరం, ప్రభుత్వ ఫీజు ₹0 (CSC గరిష్ఠంగా ₹30 మాత్రమే). PM-KISAN, ఆయుష్మాన్ భారత్ వంటి ఏ పథకం గురించైనా అడగండి.',
    scheme: '{title}: ప్రయోజనం {amount} {freq}. ముఖ్య పత్రాలు: {docs}. ప్రభుత్వ ఫీజు: ₹{fee}.',
    openEligibility: 'అర్హత తనిఖీ తెరవండి',
    openDocuments: 'పత్రాల జాబితా తెరవండి',
    viewScheme: 'పథకం చూడండి',
    browseAll: 'అన్ని పథకాలు',
  },
  mr: {
    eligibility: '2 मिनिटांत तुमची पात्रता तपासण्यासाठी 4 सोप्या प्रश्नांची उत्तरे द्या. खालील बटण दाबून सुरुवात करा.',
    documents: 'बहुतेक योजनांसाठी आधार, आधारशी जोडलेले बँक पासबुक (IFSC आणि बँकेच्या शिक्क्यासह) आणि रेशन किंवा उत्पन्न दाखला लागतो. खाली तुमची तयारी पाहा.',
    fallback: 'प्रत्येक योजनेसाठी आधारशी जोडलेले बँक खाते आवश्यक आहे आणि सरकारी शुल्क ₹0 आहे (CSC जास्तीत जास्त ₹30 घेऊ शकते). PM-KISAN, आयुष्मान भारत अशा कोणत्याही योजनेबद्दल विचारा.',
    scheme: '{title}: लाभ {amount} {freq}. मुख्य कागदपत्रे: {docs}. सरकारी शुल्क: ₹{fee}.',
    openEligibility: 'पात्रता तपासणी उघडा',
    openDocuments: 'कागदपत्रांची यादी उघडा',
    viewScheme: 'योजना पाहा',
    browseAll: 'सर्व योजना',
  },
  ml: {
    eligibility: '2 മിനിറ്റിനുള്ളിൽ നിങ്ങളുടെ അർഹത അറിയാൻ 4 ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക. താഴെയുള്ള ബട്ടൺ അമർത്തി തുടങ്ങുക.',
    documents: 'മിക്ക പദ്ധതികൾക്കും ആധാർ, ആധാറുമായി ബന്ധിപ്പിച്ച ബാങ്ക് പാസ്ബുക്ക് (IFSC, ബാങ്ക് സീൽ സഹിതം), റേഷൻ അല്ലെങ്കിൽ വരുമാന സർട്ടിഫിക്കറ്റ് വേണം. താഴെ നിങ്ങളുടെ തയ്യാറെടുപ്പ് നോക്കുക.',
    fallback: 'എല്ലാ പദ്ധതികൾക്കും ആധാറുമായി ബന്ധിപ്പിച്ച ബാങ്ക് അക്കൗണ്ട് വേണം, സർക്കാർ ഫീസ് ₹0 (CSC പരമാവധി ₹30 മാത്രം). PM-KISAN, ആയുഷ്മാൻ ഭാരത് പോലുള്ള ഏത് പദ്ധതിയെക്കുറിച്ചും ചോദിക്കൂ.',
    scheme: '{title}: ആനുകൂല്യം {amount} {freq}. പ്രധാന രേഖകൾ: {docs}. സർക്കാർ ഫീസ്: ₹{fee}.',
    openEligibility: 'അർഹതാ പരിശോധന തുറക്കുക',
    openDocuments: 'രേഖകളുടെ പട്ടിക തുറക്കുക',
    viewScheme: 'പദ്ധതി കാണുക',
    browseAll: 'എല്ലാ പദ്ധതികളും',
  },
  gu: {
    eligibility: '2 મિનિટમાં તમારી પાત્રતા જાણવા 4 સરળ પ્રશ્નોના જવાબ આપો. નીચેનું બટન દબાવીને શરૂ કરો.',
    documents: 'મોટાભાગની યોજનાઓ માટે આધાર, આધાર સાથે જોડાયેલી બેંક પાસબુક (IFSC અને બેંકની મહોર સાથે) અને રેશન કે આવકનો દાખલો જોઈએ. નીચે તમારી તૈયારી જુઓ.',
    fallback: 'દરેક યોજના માટે આધાર સાથે જોડાયેલું બેંક ખાતું જરૂરી છે અને સરકારી ફી ₹0 છે (CSC વધુમાં વધુ ₹30 લઈ શકે). PM-KISAN, આયુષ્માન ભારત જેવી કોઈ પણ યોજના વિશે પૂછો.',
    scheme: '{title}: લાભ {amount} {freq}. મુખ્ય દસ્તાવેજો: {docs}. સરકારી ફી: ₹{fee}.',
    openEligibility: 'પાત્રતા તપાસ ખોલો',
    openDocuments: 'દસ્તાવેજોની યાદી ખોલો',
    viewScheme: 'યોજના જુઓ',
    browseAll: 'બધી યોજનાઓ',
  },
  or: {
    eligibility: '2 ମିନିଟରେ ଆପଣଙ୍କ ଯୋଗ୍ୟତା ଜାଣିବାକୁ 4ଟି ସହଜ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ। ତଳ ବଟନ୍ ଦବାଇ ଆରମ୍ଭ କରନ୍ତୁ।',
    documents: 'ଅଧିକାଂଶ ଯୋଜନା ପାଇଁ ଆଧାର, ଆଧାର ସହ ଯୋଡ଼ା ବ୍ୟାଙ୍କ ପାସବୁକ୍ (IFSC ଓ ବ୍ୟାଙ୍କ ମୋହର ସହ) ଏବଂ ରାସନ ବା ଆୟ ପ୍ରମାଣପତ୍ର ଦରକାର। ତଳେ ଆପଣଙ୍କ ପ୍ରସ୍ତୁତି ଦେଖନ୍ତୁ।',
    fallback: 'ପ୍ରତ୍ୟେକ ଯୋଜନା ପାଇଁ ଆଧାର ସହ ଯୋଡ଼ା ବ୍ୟାଙ୍କ ଖାତା ଦରକାର, ସରକାରୀ ଫିସ୍ ₹0 (CSC ସର୍ବାଧିକ ₹30 ନେଇପାରେ)। PM-KISAN, ଆୟୁଷ୍ମାନ ଭାରତ ଭଳି ଯେକୌଣସି ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ।',
    scheme: '{title}: ସୁବିଧା {amount} {freq}। ମୁଖ୍ୟ କାଗଜପତ୍ର: {docs}। ସରକାରୀ ଫିସ୍: ₹{fee}।',
    openEligibility: 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ ଖୋଲନ୍ତୁ',
    openDocuments: 'କାଗଜପତ୍ର ତାଲିକା ଖୋଲନ୍ତୁ',
    viewScheme: 'ଯୋଜନା ଦେଖନ୍ତୁ',
    browseAll: 'ସମସ୍ତ ଯୋଜନା',
  },
  pa: {
    eligibility: '2 ਮਿੰਟਾਂ ਵਿੱਚ ਆਪਣੀ ਯੋਗਤਾ ਜਾਣਨ ਲਈ 4 ਸੌਖੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ। ਹੇਠਾਂ ਦਿੱਤਾ ਬਟਨ ਦਬਾ ਕੇ ਸ਼ੁਰੂ ਕਰੋ।',
    documents: 'ਜ਼ਿਆਦਾਤਰ ਯੋਜਨਾਵਾਂ ਲਈ ਆਧਾਰ, ਆਧਾਰ ਨਾਲ ਜੁੜੀ ਬੈਂਕ ਪਾਸਬੁੱਕ (IFSC ਅਤੇ ਬੈਂਕ ਦੀ ਮੋਹਰ ਨਾਲ) ਅਤੇ ਰਾਸ਼ਨ ਜਾਂ ਆਮਦਨ ਸਰਟੀਫਿਕੇਟ ਚਾਹੀਦਾ ਹੈ। ਹੇਠਾਂ ਆਪਣੀ ਤਿਆਰੀ ਦੇਖੋ।',
    fallback: 'ਹਰ ਯੋਜਨਾ ਲਈ ਆਧਾਰ ਨਾਲ ਜੁੜਿਆ ਬੈਂਕ ਖਾਤਾ ਜ਼ਰੂਰੀ ਹੈ ਅਤੇ ਸਰਕਾਰੀ ਫ਼ੀਸ ₹0 ਹੈ (CSC ਵੱਧ ਤੋਂ ਵੱਧ ₹30 ਲੈ ਸਕਦਾ ਹੈ)। PM-KISAN, ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਵਰਗੀ ਕਿਸੇ ਵੀ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ।',
    scheme: '{title}: ਲਾਭ {amount} {freq}। ਮੁੱਖ ਦਸਤਾਵੇਜ਼: {docs}। ਸਰਕਾਰੀ ਫ਼ੀਸ: ₹{fee}।',
    openEligibility: 'ਯੋਗਤਾ ਜਾਂਚ ਖੋਲ੍ਹੋ',
    openDocuments: 'ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਸੂਚੀ ਖੋਲ੍ਹੋ',
    viewScheme: 'ਯੋਜਨਾ ਦੇਖੋ',
    browseAll: 'ਸਾਰੀਆਂ ਯੋਜਨਾਵਾਂ',
  },
  ur: {
    eligibility: '2 منٹ میں اپنی اہلیت جاننے کے لیے 4 آسان سوالوں کے جواب دیں۔ نیچے دیا گیا بٹن دبا کر شروع کریں۔',
    documents: 'زیادہ تر اسکیموں کے لیے آدھار، آدھار سے جڑی بینک پاس بک (IFSC اور بینک کی مہر کے ساتھ) اور راشن یا آمدنی کا سرٹیفکیٹ چاہیے۔ نیچے اپنی تیاری دیکھیں۔',
    fallback: 'ہر اسکیم کے لیے آدھار سے جڑا بینک کھاتا ضروری ہے اور سرکاری فیس ₹0 ہے (CSC زیادہ سے زیادہ ₹30 لے سکتا ہے)۔ PM-KISAN، آیوشمان بھارت جیسی کسی بھی اسکیم کے بارے میں پوچھیں۔',
    scheme: '{title}: فائدہ {amount} {freq}۔ اہم کاغذات: {docs}۔ سرکاری فیس: ₹{fee}۔',
    openEligibility: 'اہلیت جانچ کھولیں',
    openDocuments: 'کاغذات کی فہرست کھولیں',
    viewScheme: 'اسکیم دیکھیں',
    browseAll: 'تمام اسکیمیں',
  },
  as: {
    eligibility: '2 মিনিটত আপোনাৰ যোগ্যতা জানিবলৈ 4টা সহজ প্ৰশ্নৰ উত্তৰ দিয়ক। তলৰ বুটামটো টিপি আৰম্ভ কৰক।',
    documents: 'বেছিভাগ আঁচনিৰ বাবে আধাৰ, আধাৰৰ সৈতে সংযুক্ত বেংক পাছবুক (IFSC আৰু বেংকৰ মোহৰ সহ) আৰু ৰেচন বা আয়ৰ প্ৰমাণপত্ৰ লাগে। তলত আপোনাৰ প্ৰস্তুতি চাওক।',
    fallback: 'প্ৰতিটো আঁচনিৰ বাবে আধাৰ-সংযুক্ত বেংক একাউণ্ট লাগে আৰু চৰকাৰী মাচুল ₹0 (CSCয়ে সৰ্বাধিক ₹30 ল’ব পাৰে)। PM-KISAN, আয়ুষ্মান ভাৰতৰ দৰে যিকোনো আঁচনিৰ বিষয়ে সোধক।',
    scheme: '{title}: সুবিধা {amount} {freq}। মূল নথি-পত্ৰ: {docs}। চৰকাৰী মাচুল: ₹{fee}।',
    openEligibility: 'যোগ্যতা পৰীক্ষা খোলক',
    openDocuments: 'নথি-পত্ৰৰ তালিকা খোলক',
    viewScheme: 'আঁচনি চাওক',
    browseAll: 'সকলো আঁচনি',
  },
};

/** Look up a UI string in the reply language, falling back to English, then to the raw key. */
function tr(language: SupportedLanguage, key: string): string {
  return translations[language]?.[key] || translations.en[key] || key;
}

function findMatchingScheme(query: string): Scheme | undefined {
  const lower = query.toLowerCase().normalize('NFC');

  // 1. Direct keyword mapping
  for (const entry of KEYWORD_TO_SCHEME_ID) {
    if (entry.keywords.some((kw) => lower.includes(kw.normalize('NFC')))) {
      const found = verifiedSchemes.find((s) => s.id === entry.schemeId);
      if (found) return found;
    }
  }

  // 2. Fuzzy match against scheme titles, slugs and life events
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
  const lower = clean.toLowerCase().normalize('NFC');
  const p = PHRASES[language] ?? PHRASES.en;

  if (ELIGIBILITY_WORDS.some((w) => lower.includes(w.normalize('NFC')))) {
    return { text: p.eligibility, actionLink: { to: '/eligibility', label: p.openEligibility } };
  }

  if (DOCUMENT_WORDS.some((w) => lower.includes(w.normalize('NFC')))) {
    return { text: p.documents, actionLink: { to: '/documents', label: p.openDocuments } };
  }

  const matched = findMatchingScheme(clean);
  if (matched) {
    // Language-neutral figure + translated frequency (never the Kannada-annotated display string)
    const amount = `₹${matched.financialBenefit.amount.toLocaleString('en-IN')}`;
    const freq = tr(language, matched.financialBenefit.frequencyKey);
    const docs = matched.documents
      .slice(0, 3)
      .map((d) => tr(language, d.nameKey))
      .join(', ');
    const text = p.scheme
      .replace('{title}', tr(language, matched.titleKey))
      .replace('{amount}', amount)
      .replace('{freq}', freq)
      .replace('{docs}', docs)
      .replace('{fee}', matched.statutoryFee.amount.toLocaleString('en-IN'));
    return { text, actionLink: { to: `/schemes/${matched.id}`, label: p.viewScheme } };
  }

  return { text: p.fallback, actionLink: { to: '/schemes', label: p.browseAll } };
}
