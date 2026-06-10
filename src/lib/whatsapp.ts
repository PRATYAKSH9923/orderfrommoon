import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface WhatsAppMessageParams {
  restaurantName: string;
  orderNumber: string;
  items: Pick<CartItem, "name" | "price" | "quantity" | "variantLabel">[];
  total: number;
  customerName: string;
  customerPhone: string;
  currency?: string;
}

/**
 * Build the pre-filled WhatsApp confirmation message. It is written in
 * English + Hindi + Punjabi because the restaurant's customers speak all three.
 */
export function buildWhatsAppMessage({
  restaurantName,
  orderNumber,
  items,
  total,
  customerName,
  customerPhone,
  currency = "₹",
}: WhatsAppMessageParams): string {
  const itemLines = items
    .map((i) => {
      const label = i.variantLabel ? `${i.name} (${i.variantLabel})` : i.name;
      return `• ${label} × ${i.quantity} — ${formatPrice(
        i.price * i.quantity,
        currency
      )}`;
    })
    .join("\n");

  // Tri-lingual confirmation header.
  return [
    `*${restaurantName}*`,
    `🧇 Just Waffle It`,
    ``,
    `Order / ऑर्डर / ਆਰਡਰ: *${orderNumber}*`,
    ``,
    `*Items / आइटम / ਆਈਟਮ:*`,
    itemLines,
    ``,
    `*Total / कुल / ਕੁੱਲ: ${formatPrice(total, currency)}*`,
    ``,
    `Name / नाम / ਨਾਮ: ${customerName}`,
    `Mobile / मोबाइल / ਮੋਬਾਈਲ: ${customerPhone}`,
    ``,
    `Please confirm my order 🙏`,
    `कृपया मेरे ऑर्डर की पुष्टि करें 🙏`,
    `ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਆਰਡਰ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ 🙏`,
  ].join("\n");
}

/** Build a wa.me deep link to the restaurant's number with the message. */
export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string
): string {
  // wa.me expects digits only (no +). Encode the message.
  const number = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
