/** WhatsApp link builders — implemented in Phase 1. */
export function whatsappLink(number: string, message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}
