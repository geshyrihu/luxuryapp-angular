import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

/**
 * 🍔 ILI ACTION MENU (móvil)
 * -------------------------------------------------------------------------
 * Versión Ionic/móvil del menú de acciones. Se abre como bottom-sheet nativo.
 *
 * A diferencia de `app-action-menu` (web, p-popover), usa un overlay propio con
 * `<ng-content>` directo — evita el problema de proyección de contenido dentro
 * de `ion-popover`.
 *
 * USO: solo dentro de `<app-data-view-mobile>`, con botones `ili-*` (mobile-label).
 * Ver `core/components/buttons/BUTTON-USAGE-RULES.md`.
 *
 * El sheet se cierra 60ms después de cualquier clic interno, dejando tiempo a
 * que el handler del botón (SweetAlert / AlertController) abra encima.
 */
@Component({
  selector: "ili-action-menu",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      class="ili-am-trigger"
      (click)="open.set(true)"
      aria-label="Opciones"
    >
      <app-icon icon="mdi:dots-vertical" />
    </button>

    @if (open()) {
      <div class="ili-am-backdrop" (click)="open.set(false)">
        <div class="ili-am-sheet" (click)="onInnerClick()">
          <div class="ili-am-handle"></div>
          <div class="ili-am-actions">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ili-am-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        background: none;
        color: var(--ds-text-secondary);
        border-radius: 9999px;
        font-size: 1.25rem;
      }
      .ili-am-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.4));
      }
      .ili-am-sheet {
        width: 100%;
        max-width: 480px;
        background: var(--ds-bg-surface, #fff);
        border-radius: var(--ds-radius-modal, 12px) var(--ds-radius-modal, 12px) 0 0;
        padding: 0.5rem 1rem calc(1rem + env(safe-area-inset-bottom));
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      }
      .ili-am-handle {
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--ds-border-strong, #cbd5e1);
        margin: 0.25rem auto 0.75rem;
      }
      .ili-am-actions {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      /* Botones a lo ancho para área táctil cómoda */
      .ili-am-actions ::ng-deep ion-button {
        --border-radius: var(--ds-radius-md, 6px);
        margin: 0;
        width: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileActionMenu {
  protected open = signal(false);

  protected onInnerClick(): void {
    setTimeout(() => this.open.set(false), 60);
  }
}
