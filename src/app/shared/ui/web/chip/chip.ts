import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from "@angular/core";
import { ChipBase } from "@ui/base/chip.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

/**
 * AppChip — CSS propio (badge redondeado). Renderiza icono (`app-icon`),
 * etiqueta e imagen opcionales, con color semántico y botón de remoción.
 */
@Component({
  selector: "app-chip",

  imports: [AppIcon],
  template: `
    <span class="app-chip" [class]="chipClass()" (click)="onClick()">
      @if (image()) {
        <img [src]="image()" class="app-chip-img" alt="" />
      } @else if (icon()) {
        <app-icon [icon]="icon()" class="app-chip-icon" />
      }
      <span class="app-chip-label">{{ label() }}</span>
      @if (removable() && !disabled()) {
        <button
          type="button"
          class="app-chip-remove"
          aria-label="Quitar"
          (click)="$event.stopPropagation(); onRemove()"
        >
          <app-icon icon="material-symbols-light:close" />
        </button>
      }
    </span>
  `,
  styles: [
    `
      .app-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.75rem;
        border-radius: var(--ds-radius-full, 9999px);
        font-size: 0.875rem;
        line-height: 1.4;
        cursor: default;
      }
      .app-chip.app-chip-clickable {
        cursor: pointer;
      }
      .app-chip.app-chip-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .app-chip-img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        object-fit: cover;
        margin-left: -0.25rem;
      }
      .app-chip-icon {
        display: inline-flex;
        font-size: 1rem;
      }
      .app-chip-remove {
        display: inline-flex;
        align-items: center;
        background: none;
        border: none;
        padding: 0;
        margin-left: 0.1rem;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
      }
      .app-chip-remove:hover {
        opacity: 1;
      }
      /* Colores semánticos */
      .app-chip.app-chip-primary {
        background: var(--ds-primary-light);
        color: var(--ds-primary);
      }
      .app-chip.app-chip-secondary {
        background: var(--ds-secondary-light);
        color: var(--ds-accent-text-warning);
      }
      .app-chip.app-chip-success {
        background: var(--ds-success-light);
        color: var(--ds-success);
      }
      .app-chip.app-chip-warning {
        background: var(--ds-warning-light);
        color: var(--ds-accent-text-warning);
      }
      .app-chip.app-chip-danger {
        background: var(--ds-danger-light);
        color: var(--ds-danger);
      }
      .app-chip.app-chip-neutral {
        background: var(--ds-bg-muted);
        color: var(--ds-text-secondary);
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

