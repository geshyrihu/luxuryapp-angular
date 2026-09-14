import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { MenuBase } from "@ui/base/menu.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * AppMenu — panel flotante sobre CDK Overlay. [Fase 3 migración
 * Bootstrap, 2026-09-13, segunda corrección] La versión anterior sobre
 * NgbDropdown crasheaba en producción (NG0201): `ngbDropdownToggle` en
 * contenido proyectado no puede inyectar su `NgbDropdown` padre vía
 * `@Host()` a través de la frontera de `<ng-content>`. CDK Overlay no
 * tiene ese problema (mismo patrón ya probado en
 * `shared/ui/mobile/action-menu-mobile.ts`).
 */
@Component({
  selector: "app-menu",
  imports: [NgTemplateOutlet, AppIcon],
  template: `
    <span #trigger class="app-menu-trigger" (click)="toggle()">
      <ng-content select="[appMenuTrigger]" />
    </span>
    <ng-template #panelTpl>
      <div class="dropdown-menu show app-menu-panel" [class]="styleClass()">
        @for (item of model() ?? []; track $index) {
          @if (item.separator) {
            <div class="dropdown-divider"></div>
          } @else {
            <button
              class="dropdown-item"
              type="button"
              [disabled]="item.disabled"
              (click)="onItemClick(item, $event)"
            >
              @if (itemTemplate()) {
                <ng-container
                  [ngTemplateOutlet]="itemTemplate()!"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
              } @else {
                @if (item.icon) {
                  <app-icon [icon]="item.icon" class="me-2" />
                }
                {{ item.label }}
              }
            </button>
          }
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .app-menu-trigger {
        display: inline-block;
      }
      .app-menu-panel {
        flex: 0 0 auto;
        width: max-content;
        max-width: min(90vw, 20rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMenu extends MenuBase {
  itemTemplate = input<TemplateRef<unknown>>();

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private trigger = viewChild.required<ElementRef<HTMLElement>>("trigger");
  private panelTpl = viewChild.required<TemplateRef<unknown>>("panelTpl");
  private overlayRef?: OverlayRef;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  toggle(): void {
    if (this.overlayRef) {
      this.close();
    } else {
      this.openPanel();
    }
  }

  close(): void {
    this.dispose();
  }

  private openPanel(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger())
      .withFlexibleDimensions(false)
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
          offsetY: 4,
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom",
          offsetY: -4,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: "cdk-overlay-transparent-backdrop",
    });
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.attach(new TemplatePortal(this.panelTpl(), this.vcr));
  }

  private dispose(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  protected onItemClick(item: any, event: Event): void {
    if (item.disabled) return;
    item.command?.({ originalEvent: event, item });
    this.close();
  }
}
