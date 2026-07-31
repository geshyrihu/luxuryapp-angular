export type SeverityType = 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';

export type ConventionDomain =
  | 'core'
  | 'backend'
  | 'frontend'
  | 'flutter'
  | 'ui'
  | 'styles'
  | 'catalogs'
  | 'audit'
  | 'operations';

export type ConventionTaskType =
  | 'implementacion-backend'
  | 'implementacion-frontend'
  | 'implementacion-flutter'
  | 'auditoria'
  | 'documentacion'
  | 'operacion-transversal'
  | 'creacion-modulo-fase-0';

export const SeverityConfig: Record<SeverityType, { color: string; icon: string }> = {
  CRÍTICA: { color: 'var(--severity-critica)', icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
};

export function severityColor(severity: SeverityType): string {
  return SeverityConfig[severity]?.color ?? 'var(--color-neutral-500)';
}

export function severityIcon(severity: SeverityType): string {
  return SeverityConfig[severity]?.icon ?? 'NA';
}

export function domainLabel(domain: ConventionDomain): string {
  const labels: Record<ConventionDomain, string> = {
    core: 'Core',
    backend: 'Backend',
    frontend: 'Frontend',
    flutter: 'Flutter',
    ui: 'UI',
    styles: 'Styles',
    catalogs: 'Catalogos',
    audit: 'Auditoria',
    operations: 'Operacion',
  };

  return labels[domain];
}

export function taskTypeLabel(taskType: ConventionTaskType): string {
  const labels: Record<ConventionTaskType, string> = {
    'implementacion-backend': 'Implementacion Backend',
    'implementacion-frontend': 'Implementacion Frontend/UI',
    'implementacion-flutter': 'Implementacion Flutter',
    auditoria: 'Auditoria',
    documentacion: 'Documentacion',
    'operacion-transversal': 'Operacion Transversal',
    'creacion-modulo-fase-0': 'Creacion Modulo (FASE 0)',
  };

  return labels[taskType];
}
