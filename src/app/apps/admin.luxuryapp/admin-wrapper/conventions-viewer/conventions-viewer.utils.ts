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
  | 'operacion-transversal';

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

export function sectionToDomain(section: number): ConventionDomain {
  switch (section) {
    case 1:
      return 'core';
    case 2:
    case 4:
      return 'frontend';
    case 3:
    case 5:
    case 6:
    case 8:
    case 15:
      return 'ui';
    case 7:
    case 14:
      return 'catalogs';
    case 9:
    case 18:
      return 'backend';
    case 10:
    case 11:
    case 12:
    case 17:
    case 21:
    case 22:
      return 'operations';
    case 13:
      return 'flutter';
    case 19:
    case 20:
      return 'audit';
    default:
      return 'core';
  }
}

export function domainLabel(domain: ConventionDomain): string {
  const labels: Record<ConventionDomain, string> = {
    core: 'Core',
    backend: 'Backend',
    frontend: 'Frontend',
    flutter: 'Flutter',
    ui: 'UI',
    styles: 'Styles',
    catalogs: 'Catálogos',
    audit: 'Auditoría',
    operations: 'Operación',
  };

  return labels[domain];
}

export function sectionToTaskType(section: number): ConventionTaskType {
  switch (sectionToDomain(section)) {
    case 'backend':
      return 'implementacion-backend';
    case 'frontend':
    case 'ui':
    case 'styles':
    case 'catalogs':
      return 'implementacion-frontend';
    case 'flutter':
      return 'implementacion-flutter';
    case 'audit':
      return 'auditoria';
    case 'operations':
      return 'documentacion';
    case 'core':
    default:
      return 'operacion-transversal';
  }
}

export function taskTypeLabel(taskType: ConventionTaskType): string {
  const labels: Record<ConventionTaskType, string> = {
    'implementacion-backend': 'Implementación Backend',
    'implementacion-frontend': 'Implementación Frontend/UI',
    'implementacion-flutter': 'Implementación Flutter',
    auditoria: 'Auditoría',
    documentacion: 'Documentación',
    'operacion-transversal': 'Operación Transversal',
  };

  return labels[taskType];
}
