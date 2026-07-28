export type SeverityType = 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';

export const SeverityConfig: Record<SeverityType, { color: string; icon: string }> = {
  CRÍTICA: { color: 'var(--severity-critica)', icon: '🔴' },
  ALTA: { color: 'var(--severity-alta)', icon: '🟠' },
  MEDIA: { color: 'var(--severity-media)', icon: '🟡' },
  BAJA: { color: 'var(--severity-baja)', icon: '🔵' },
};

export function severityColor(severity: SeverityType): string {
  return SeverityConfig[severity]?.color ?? 'var(--color-neutral-500)';
}

export function severityIcon(severity: SeverityType): string {
  return SeverityConfig[severity]?.icon ?? '⚫';
}
