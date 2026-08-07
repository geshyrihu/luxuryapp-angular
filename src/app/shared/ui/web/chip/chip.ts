import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from "@angular/core";
import { ChipBase } from "@ui/base/chip.base";
import { ChipModule } from "primeng/chip";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * AppChip — Wrapper sobre p-chip. Renderiza icono (`app-icon`), etiqueta e
 * imagen opcionales, con color semántico y botón de remoción.
 */
@Component({
  selector: "app-chip",

  imports: [ChipModule, AppIcon],
  template: `
    <p-chip
      [label]="label()"
      [image]="image() || undefined"
      [removable]="removable() && !disabled()"
      [class]="chipClass()"
      (onRemove)="onRemove()"
      (click)="onClick()"
    >
      @if (icon() && !image()) {
        <app-icon [icon]="icon()" class="app-chip-icon" />
      }
      <!-- Icono de remoción vía app-icon (evita el primeicon TimesCircle) -->
      <ng-template #removeicon>
        <app-icon icon="mdi:close" />
      </ng-template>
    </p-chip>
  `,
  styles: [
    `
      app-chip .p-chip {
        cursor: default;
      }
      app-chip .p-chip.app-chip-clickable {
        cursor: pointer;
      }
      app-chip .p-chip.app-chip-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .app-chip-icon {
        display: inline-flex;
        margin-right: 0.35rem;
        font-size: 1rem;
      }
      /* Colores semánticos */
      app-chip .p-chip.app-chip-primary {
        background: var(--ds-primary-light, #dbeafe);
        color: var(--ds-primary, #2563eb);
      }
      app-chip .p-chip.app-chip-secondary {
        background: var(--ds-secondary-light, #ede9fe);
        color: var(--ds-secondary, #7c3aed);
      }
      app-chip .p-chip.app-chip-success {
        background: var(--ds-success-light, #dcfce7);
        color: var(--ds-success, #16a34a);
      }
      app-chip .p-chip.app-chip-warning {
        background: var(--ds-warning-light, #fef3c7);
        color: var(--ds-warning, #d97706);
      }
      app-chip .p-chip.app-chip-danger {
        background: var(--ds-danger-light, #fee2e2);
        color: var(--ds-danger, #dc2626);
      }
      app-chip .p-chip.app-chip-neutral {
        background: var(--ds-bg-muted, #f1f5f9);
        color: var(--ds-text-secondary, #475569);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppChip extends ChipBase {
  chipClass = computed<string>(() => {
    const parts = [`app-chip-${this.color()}`];
    if (this.clickable()) parts.push("app-chip-clickable");
    if (this.disabled()) parts.push("app-chip-disabled");
    return parts.join(" ");
  });
}
