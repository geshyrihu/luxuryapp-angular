import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import {
  Component,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * 🍔 ILI ACTION MENU (móvil)
 * -------------------------------------------------------------------------
 * Versión Ionic/móvil del menú de acciones. Se abre como bottom-sheet nativo.
 *
 * El sheet se renderiza mediante **CDK Overlay** a nivel de `document.body`.
 * Esto es imprescindible: dentro de la lista de Ionic (`.ion-page`/`ion-content`
 * usan `contain`/`transform`) un `position: fixed` queda atrapado en el bloque
 * contenedor y se dibuja detrás de los items. El overlay escapa ese contexto.
 *
 * La proyección de contenido (`<ng-content>`) se preserva con `TemplatePortal`,
 * que instancia el template en el contexto de este componente.
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
      (click)="openSheet()"
      aria-label="Opciones"
    >
      <app-icon icon="mdi:dots-vertical" />
    </button>

    <ng-template #sheetTpl>
      <div class="ili-am-backdrop" (click)="close()">
        <div class="ili-am-sheet" (click)="onInnerClick($event)">
          <div class="ili-am-handle"></div>
          @if (title()) {
            <div class="ili-am-title">{{ title() }}</div>
          }
          <div class="ili-am-actions ili-menu-list">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </ng-template>
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
        border-radius: var(--ds-m-radius-sheet, 16px) var(--ds-m-radius-sheet, 16px) 0 0;
        padding: 0.5rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom));
        box-shadow: var(--ds-shadow-2xl, 0 -4px 24px rgba(0, 0, 0, 0.15));
        animation: ili-am-slide-up 0.22s cubic-bezier(0.32, 0.72, 0, 1);
      }
      @keyframes ili-am-slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .ili-am-handle {
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: var(--ds-border-strong, #cbd5e1);
        margin: 0.25rem auto 0.5rem;
      }
      .ili-am-title {
        text-align: center;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--ds-text-muted);
        padding: 0.25rem 0 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileActionMenu {
  /** Título opcional del action-sheet (encabezado tenue, estilo iOS). */
  title = input<string>("");

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);

  private sheetTpl = viewChild.required<TemplateRef<unknown>>("sheetTpl");
  private overlayRef?: OverlayRef;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  protected openSheet(): void {
    if (this.overlayRef) return;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: false,
    });
    this.overlayRef.attach(new TemplatePortal(this.sheetTpl(), this.vcr));
  }

  protected close(): void {
    this.dispose();
  }

  protected onInnerClick(event: Event): void {
    // Evita que el clic burbujee al backdrop y cierre de inmediato:
    // el handler del botón (SweetAlert / AlertController) necesita esos 60ms.
    event.stopPropagation();
    setTimeout(() => this.dispose(), 60);
  }

  private dispose(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
