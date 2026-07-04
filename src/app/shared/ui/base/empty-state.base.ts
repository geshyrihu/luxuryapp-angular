import { Directive, input, output } from "@angular/core";

export type EmptyStateSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warn"
  | "danger";

/**
 * Base compartida de EmptyState. Contiene la API pública (inputs/outputs) que
 * comparten las tres piezas del patrón multiplataforma:
 *  - web:     `app-empty-state`  (PrimeNG)      → components/web/empty-state
 *  - mobile:  `ili-empty-state`  (Ionic)        → components/mobile/empty-state
 *  - wrapper: `lx-empty-state`   (auto runtime) → components/shared/empty-state
 */
@Directive()
export abstract class EmptyStateBase {
  icon = input<string>("mdi:database-off-outline");
  iconColor = input<string>("var(--ds-text-muted)");
  title = input<string>("Sin registros");
  message = input<string>("No hay datos disponibles.");
  actionLabel = input<string>("");
  actionIcon = input<string>("mdi:plus");
  actionSeverity = input<EmptyStateSeverity>("primary");
  tag = input<string>("");

  action = output<void>();
}
