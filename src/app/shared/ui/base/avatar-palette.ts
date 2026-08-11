/**
 * Paleta categórica de avatares (RN-DS-036 · Sprint 3 T3.2).
 *
 * Extraída de `comment-thread.base`, `contact-card.base` y `profile-card.base`,
 * que duplicaban la misma paleta literal de 6 colores. Codifica identidad
 * (usuario), no significado: usa `--ds-cat-1..6`, no los semánticos.
 * El texto sobre el relleno debe usar `--ds-on-cat`.
 */
export const AVATAR_PALETTE: readonly string[] = [
  'var(--ds-cat-1)',
  'var(--ds-cat-2)',
  'var(--ds-cat-3)',
  'var(--ds-cat-4)',
  'var(--ds-cat-5)',
  'var(--ds-cat-6)',
];

export function avatarBackground(seed: string): string {
  let h = 0;
  for (const ch of seed) h = ch.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}
