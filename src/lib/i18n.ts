// ============================================================================
//  Trilingual strings (English / Hindi / Punjabi).
//  One language is shown at a time; the active language is chosen via the
//  LanguageSwitcher and stored in localStorage (see LanguageProvider).
// ============================================================================

export type Lang = "en" | "hi" | "pa";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हि" },
  { code: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
];

type Entry = { en: string; hi: string; pa: string };

export const strings = {
  // Landing
  tagline: { en: "Just Waffle It", hi: "जस्ट वैफल इट", pa: "ਜਸਟ ਵੈਫਲ ਇਟ" },
  consumer: { en: "Consumer", hi: "ग्राहक", pa: "ਗਾਹਕ" },
  consumerSub: { en: "Order food", hi: "खाना ऑर्डर करें", pa: "ਖਾਣਾ ਆਰਡਰ ਕਰੋ" },
  admin: { en: "Admin", hi: "एडमिन", pa: "ਐਡਮਿਨ" },
  adminSub: { en: "Manage orders", hi: "ऑर्डर प्रबंधित करें", pa: "ਆਰਡਰ ਪ੍ਰਬੰਧਿਤ ਕਰੋ" },
  installHint: {
    en: "Install to your home screen",
    hi: "होम स्क्रीन पर इंस्टॉल करें",
    pa: "ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ ਇੰਸਟਾਲ ਕਰੋ",
  },

  // Menu / cart
  searchMenu: { en: "Search menu…", hi: "मेन्यू खोजें…", pa: "ਮੀਨੂੰ ਖੋਜੋ…" },
  items: { en: "items", hi: "आइटम", pa: "ਆਈਟਮ" },
  add: { en: "ADD", hi: "जोड़ें", pa: "ਸ਼ਾਮਲ" },
  single: { en: "Single", hi: "सिंगल", pa: "ਸਿੰਗਲ" },
  noResults: { en: "No items found", hi: "कोई आइटम नहीं मिला", pa: "ਕੋਈ ਆਈਟਮ ਨਹੀਂ ਮਿਲੀ" },
  bestseller: { en: "Bestseller", hi: "बेस्टसेलर", pa: "ਬੈਸਟਸੈਲਰ" },
  doubleLayer: { en: "Double layer", hi: "डबल लेयर", pa: "ਡਬਲ ਲੇਅਰ" },
  ofWord: { en: "of", hi: "में से", pa: "ਵਿੱਚੋਂ" },
  jumpToMenu: { en: "MENU", hi: "मेन्यू", pa: "ਮੀਨੂੰ" },

  cart: { en: "Your Cart", hi: "आपका कार्ट", pa: "ਤੁਹਾਡਾ ਕਾਰਟ" },
  emptyCart: { en: "Your cart is empty", hi: "आपका कार्ट खाली है", pa: "ਤੁਹਾਡਾ ਕਾਰਟ ਖਾਲੀ ਹੈ" },
  viewCart: { en: "View Cart", hi: "कार्ट देखें", pa: "ਕਾਰਟ ਵੇਖੋ" },
  total: { en: "Total", hi: "कुल", pa: "ਕੁੱਲ" },
  checkout: { en: "Checkout", hi: "चेकआउट", pa: "ਚੈੱਕਆਊਟ" },

  // Checkout
  yourName: { en: "Your Name", hi: "आपका नाम", pa: "ਤੁਹਾਡਾ ਨਾਮ" },
  namePlaceholder: { en: "Enter name", hi: "नाम दर्ज करें", pa: "ਨਾਮ ਦਰਜ ਕਰੋ" },
  mobile: { en: "Mobile Number", hi: "मोबाइल नंबर", pa: "ਮੋਬਾਈਲ ਨੰਬਰ" },
  placeOrder: { en: "Place Order", hi: "ऑर्डर प्लेस करें", pa: "ਆਰਡਰ ਪਲੇਸ ਕਰੋ" },
  placing: { en: "Placing…", hi: "प्रोसेसिंग…", pa: "ਪ੍ਰੋਸੈਸਿੰਗ…" },
  reviewOrder: { en: "Review your order", hi: "अपना ऑर्डर जांचें", pa: "ਆਪਣਾ ਆਰਡਰ ਜਾਂਚੋ" },
  confirmOrder: { en: "Confirm Order", hi: "ऑर्डर कन्फर्म करें", pa: "ਆਰਡਰ ਕਨਫਰਮ ਕਰੋ" },
  back: { en: "Back", hi: "वापस", pa: "ਵਾਪਸ" },
  edit: { en: "Edit", hi: "बदलें", pa: "ਬਦਲੋ" },
  disclaimer: {
    en: "This is not an online payment. Your order is placed with the restaurant. Please send the order number on WhatsApp to confirm — WhatsApp will open automatically.",
    hi: "यह ऑनलाइन भुगतान नहीं है। आपका ऑर्डर रेस्तरां को भेज दिया गया है। पुष्टि के लिए कृपया व्हाट्सएप पर ऑर्डर नंबर भेजें — व्हाट्सएप अपने आप खुल जाएगा।",
    pa: "ਇਹ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਨਹੀਂ ਹੈ। ਤੁਹਾਡਾ ਆਰਡਰ ਰੈਸਟੋਰੈਂਟ ਨੂੰ ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਪੁਸ਼ਟੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਵਟਸਐਪ 'ਤੇ ਆਰਡਰ ਨੰਬਰ ਭੇਜੋ — ਵਟਸਐਪ ਆਪਣੇ ਆਪ ਖੁੱਲ੍ਹ ਜਾਵੇਗਾ।",
  },
  myOrders: { en: "My Orders", hi: "मेरे ऑर्डर", pa: "ਮੇਰੇ ਆਰਡਰ" },
  noOrdersYet: { en: "No orders yet today", hi: "आज अभी तक कोई ऑर्डर नहीं", pa: "ਅੱਜ ਹਾਲੇ ਕੋਈ ਆਰਡਰ ਨਹੀਂ" },
  errName: { en: "Please enter your name", hi: "कृपया नाम दर्ज करें", pa: "ਕਿਰਪਾ ਨਾਮ ਦਰਜ ਕਰੋ" },
  errPhone: {
    en: "Enter a valid 10-digit number",
    hi: "सही 10-अंकों का नंबर दर्ज करें",
    pa: "ਸਹੀ 10-ਅੰਕਾਂ ਦਾ ਨੰਬਰ ਦਰਜ ਕਰੋ",
  },
  somethingWrong: {
    en: "Something went wrong. Please retry.",
    hi: "कुछ गलत हो गया। फिर कोशिश करें।",
    pa: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  },

  // Order confirmation + WhatsApp
  orderPlaced: { en: "Order Placed!", hi: "ऑर्डर प्लेस हो गया!", pa: "ਆਰਡਰ ਪਲੇਸ ਹੋ ਗਿਆ!" },
  orderNumber: { en: "Order Number", hi: "ऑर्डर नंबर", pa: "ਆਰਡਰ ਨੰਬਰ" },
  confirmWhatsApp: {
    en: "Confirm on WhatsApp",
    hi: "व्हाट्सएप पर पुष्टि करें",
    pa: "ਵਟਸਐਪ 'ਤੇ ਪੁਸ਼ਟੀ ਕਰੋ",
  },
  alreadyPlaced: {
    en: "Your order is already placed. Just confirm it by sending the order number on WhatsApp.",
    hi: "आपका ऑर्डर पहले ही प्लेस हो चुका है। बस व्हाट्सएप पर ऑर्डर नंबर भेजकर पुष्टि करें।",
    pa: "ਤੁਹਾਡਾ ਆਰਡਰ ਪਹਿਲਾਂ ਹੀ ਪਲੇਸ ਹੋ ਚੁੱਕਾ ਹੈ। ਬੱਸ ਵਟਸਐਪ 'ਤੇ ਆਰਡਰ ਨੰਬਰ ਭੇਜ ਕੇ ਪੁਸ਼ਟੀ ਕਰੋ।",
  },
  openingWhatsApp: {
    en: "Opening WhatsApp…",
    hi: "व्हाट्सएप खुल रहा है…",
    pa: "ਵਟਸਐਪ ਖੁੱਲ੍ਹ ਰਿਹਾ ਹੈ…",
  },
  openNow: { en: "Open Now", hi: "अभी खोलें", pa: "ਹੁਣੇ ਖੋਲ੍ਹੋ" },
  trackOrder: { en: "Track Order", hi: "ऑर्डर ट्रैक करें", pa: "ਆਰਡਰ ਟਰੈਕ ਕਰੋ" },

  // Tracking
  track: { en: "Track Order", hi: "ऑर्डर ट्रैक", pa: "ਆਰਡਰ ਟਰੈਕ" },
  live: { en: "Live", hi: "लाइव", pa: "ਲਾਈਵ" },
  yourItems: { en: "Your Items", hi: "आपके आइटम", pa: "ਤੁਹਾਡੇ ਆਈਟਮ" },
  autoUpdate: {
    en: "This page updates automatically — no need to refresh.",
    hi: "यह पेज अपने आप अपडेट होता है — रिफ्रेश की जरूरत नहीं।",
    pa: "ਇਹ ਪੇਜ ਆਪਣੇ ਆਪ ਅੱਪਡੇਟ ਹੁੰਦਾ ਹੈ — ਰਿਫ੍ਰੈਸ਼ ਦੀ ਲੋੜ ਨਹੀਂ।",
  },
  orderNotFound: { en: "Order not found", hi: "ऑर्डर नहीं मिला", pa: "ਆਰਡਰ ਨਹੀਂ ਮਿਲਿਆ" },
  backToMenu: { en: "Back to Menu", hi: "मेन्यू पर वापस", pa: "ਮੀਨੂੰ 'ਤੇ ਵਾਪਸ" },

  // Statuses
  status_NEW: { en: "New", hi: "नया", pa: "ਨਵਾਂ" },
  status_ACCEPTED: { en: "Accepted", hi: "स्वीकृत", pa: "ਸਵੀਕਾਰ" },
  status_PREPARING: { en: "Preparing", hi: "तैयार हो रहा है", pa: "ਤਿਆਰ ਹੋ ਰਿਹਾ" },
  status_DONE: { en: "Ready", hi: "तैयार", pa: "ਤਿਆਰ" },

  // Admin
  adminLogin: { en: "Admin Login", hi: "एडमिन लॉगिन", pa: "ਐਡਮਿਨ ਲੌਗਇਨ" },
  username: { en: "Username", hi: "यूज़रनेम", pa: "ਯੂਜ਼ਰਨੇਮ" },
  password: { en: "Password", hi: "पासवर्ड", pa: "ਪਾਸਵਰਡ" },
  login: { en: "Login", hi: "लॉगिन", pa: "ਲੌਗਇਨ" },
  invalidLogin: {
    en: "Invalid username or password",
    hi: "गलत यूज़रनेम या पासवर्ड",
    pa: "ਗਲਤ ਯੂਜ਼ਰਨੇਮ ਜਾਂ ਪਾਸਵਰਡ",
  },
  dashboard: { en: "Admin Dashboard", hi: "एडमिन डैशबोर्ड", pa: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ" },
  tabRequested: { en: "Requested", hi: "अनुरोधित", pa: "ਬੇਨਤੀ" },
  tabActive: { en: "Active", hi: "सक्रिय", pa: "ਸਰਗਰਮ" },
  tabDone: { en: "Done", hi: "पूर्ण", pa: "ਮੁਕੰਮਲ" },
  subTodo: { en: "To-do", hi: "करना है", pa: "ਕਰਨਾ ਹੈ" },
  subPreparing: { en: "Preparing", hi: "तैयारी", pa: "ਤਿਆਰੀ" },
  noRequested: { en: "No new requests", hi: "कोई नया अनुरोध नहीं", pa: "ਕੋਈ ਨਵੀਂ ਬੇਨਤੀ ਨਹੀਂ" },
  noTodo: { en: "Nothing to prepare", hi: "तैयारी के लिए कुछ नहीं", pa: "ਤਿਆਰੀ ਲਈ ਕੁਝ ਨਹੀਂ" },
  noPreparing: { en: "Nothing being prepared", hi: "कुछ तैयार नहीं हो रहा", pa: "ਕੁਝ ਤਿਆਰ ਨਹੀਂ ਹੋ ਰਿਹਾ" },
  noDone: { en: "No completed orders today", hi: "आज कोई पूर्ण ऑर्डर नहीं", pa: "ਅੱਜ ਕੋਈ ਪੂਰਾ ਆਰਡਰ ਨਹੀਂ" },
  searchOrder: {
    en: "Search order number… e.g. 101",
    hi: "ऑर्डर नंबर खोजें… जैसे 101",
    pa: "ਆਰਡਰ ਨੰਬਰ ਖੋਜੋ… ਜਿਵੇਂ 101",
  },
  noActive: { en: "No active orders", hi: "कोई सक्रिय ऑर्डर नहीं", pa: "ਕੋਈ ਸਰਗਰਮ ਆਰਡਰ ਨਹੀਂ" },
  noCompleted: {
    en: "No completed orders today",
    hi: "आज कोई पूर्ण ऑर्डर नहीं",
    pa: "ਅੱਜ ਕੋਈ ਪੂਰਾ ਆਰਡਰ ਨਹੀਂ",
  },
  accept: { en: "Accept", hi: "स्वीकारें", pa: "ਸਵੀਕਾਰ ਕਰੋ" },
  moveToPreparing: { en: "Move to Preparing", hi: "तैयारी में डालें", pa: "ਤਿਆਰੀ 'ਚ ਪਾਓ" },
  moveToDone: { en: "Move to Done", hi: "पूर्ण करें", pa: "ਪੂਰਾ ਕਰੋ" },
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof strings;

/** Translate a single key into the given language (falls back to English). */
export function translate(key: StringKey, lang: Lang): string {
  const entry = strings[key];
  return entry?.[lang] ?? entry?.en ?? String(key);
}
