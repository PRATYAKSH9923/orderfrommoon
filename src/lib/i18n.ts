// ============================================================================
//  Lightweight trilingual strings (English / Hindi / Punjabi).
//  The restaurant serves a Hindi/Punjabi-speaking audience, so customer-facing
//  copy — especially the WhatsApp confirmation flow — is shown in all three.
//  We keep it dependency-free: a flat dictionary keyed by string id.
// ============================================================================

export type Lang = "en" | "hi" | "pa";

type Dict = Record<string, { en: string; hi: string; pa: string }>;

export const strings: Dict = {
  consumer: { en: "Consumer", hi: "ग्राहक", pa: "ਗਾਹਕ" },
  admin: { en: "Admin", hi: "एडमिन", pa: "ਐਡਮਿਨ" },
  orderNow: { en: "Order Now", hi: "अभी ऑर्डर करें", pa: "ਹੁਣੇ ਆਰਡਰ ਕਰੋ" },
  search: { en: "Search menu…", hi: "मेन्यू खोजें…", pa: "ਮੀਨੂੰ ਖੋਜੋ…" },
  cart: { en: "Cart", hi: "कार्ट", pa: "ਕਾਰਟ" },
  emptyCart: {
    en: "Your cart is empty",
    hi: "आपका कार्ट खाली है",
    pa: "ਤੁਹਾਡਾ ਕਾਰਟ ਖਾਲੀ ਹੈ",
  },
  addToCart: { en: "Add", hi: "जोड़ें", pa: "ਸ਼ਾਮਲ ਕਰੋ" },
  total: { en: "Total", hi: "कुल", pa: "ਕੁੱਲ" },
  checkout: { en: "Checkout", hi: "चेकआउट", pa: "ਚੈੱਕਆਊਟ" },
  name: { en: "Your Name", hi: "आपका नाम", pa: "ਤੁਹਾਡਾ ਨਾਮ" },
  phone: { en: "Mobile Number", hi: "मोबाइल नंबर", pa: "ਮੋਬਾਈਲ ਨੰਬਰ" },
  placeOrder: {
    en: "Place Order",
    hi: "ऑर्डर प्लेस करें",
    pa: "ਆਰਡਰ ਪਲੇਸ ਕਰੋ",
  },
  orderPlaced: {
    en: "Order Placed!",
    hi: "ऑर्डर प्लेस हो गया!",
    pa: "ਆਰਡਰ ਪਲੇਸ ਹੋ ਗਿਆ!",
  },
  orderNumber: { en: "Order Number", hi: "ऑर्डर नंबर", pa: "ਆਰਡਰ ਨੰਬਰ" },
  shareWhatsApp: {
    en: "Confirm on WhatsApp",
    hi: "व्हाट्सएप पर पुष्टि करें",
    pa: "ਵਟਸਐਪ 'ਤੇ ਪੁਸ਼ਟੀ ਕਰੋ",
  },
  trackOrder: {
    en: "Track Order",
    hi: "ऑर्डर ट्रैक करें",
    pa: "ਆਰਡਰ ਟਰੈਕ ਕਰੋ",
  },
  // WhatsApp countdown flow
  alreadyPlaced: {
    en: "Your order is already placed.",
    hi: "आपका ऑर्डर पहले ही प्लेस हो चुका है।",
    pa: "ਤੁਹਾਡਾ ਆਰਡਰ ਪਹਿਲਾਂ ਹੀ ਪਲੇਸ ਹੋ ਚੁੱਕਾ ਹੈ।",
  },
  justConfirm: {
    en: "Just confirm it by sending the order number on WhatsApp.",
    hi: "बस व्हाट्सएप पर ऑर्डर नंबर भेजकर इसकी पुष्टि करें।",
    pa: "ਬੱਸ ਵਟਸਐਪ 'ਤੇ ਆਰਡਰ ਨੰਬਰ ਭੇਜ ਕੇ ਇਸਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
  },
  openingWhatsApp: {
    en: "Opening WhatsApp in",
    hi: "व्हाट्सएप खुल रहा है",
    pa: "ਵਟਸਐਪ ਖੁੱਲ੍ਹ ਰਿਹਾ ਹੈ",
  },
  openNow: { en: "Open Now", hi: "अभी खोलें", pa: "ਹੁਣੇ ਖੋਲ੍ਹੋ" },
  seconds: { en: "sec", hi: "सेकंड", pa: "ਸਕਿੰਟ" },
  // Order status (customer tracking)
  status_NEW: { en: "New", hi: "नया", pa: "ਨਵਾਂ" },
  status_ACCEPTED: { en: "Accepted", hi: "स्वीकृत", pa: "ਸਵੀਕਾਰ ਕੀਤਾ" },
  status_PREPARING: { en: "Preparing", hi: "तैयार हो रहा है", pa: "ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ" },
  status_DONE: { en: "Ready / Done", hi: "तैयार", pa: "ਤਿਆਰ" },
};

/** Render a string in all three languages, e.g. "Add / जोड़ें / ਸ਼ਾਮਲ ਕਰੋ". */
export function tri(key: keyof typeof strings): string {
  const s = strings[key];
  if (!s) return String(key);
  return `${s.en} / ${s.hi} / ${s.pa}`;
}

/** Render a string in one language. */
export function t(key: keyof typeof strings, lang: Lang = "en"): string {
  return strings[key]?.[lang] ?? String(key);
}
