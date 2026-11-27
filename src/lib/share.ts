/**
 * Share — WhatsApp first.
 * Information about schemes travels through family and village WhatsApp groups,
 * so sharing is designed around that, falling back to the native share sheet / clipboard.
 */
export async function shareText({ title, text, url }: { title: string; text: string; url?: string }): Promise<'shared' | 'copied' | 'whatsapp'> {
  const full = url ? `${text}\n${url}` : text;
  try {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await navigator.share({ title, text, url });
      return 'shared';
    }
  } catch {
    /* user cancelled or unsupported — fall through */
  }
  try {
    await navigator.clipboard.writeText(full);
    return 'copied';
  } catch {
    /* clipboard blocked */
  }
  openWhatsApp(full);
  return 'whatsapp';
}

export function openWhatsApp(text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}
