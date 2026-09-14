import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  viewChild,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { PopoverBase } from "@ui/base/popover.base";

/**
 * AppPopover — panel flotante libre sobre CDK Overlay. [Fase 3
 * migración Bootstrap, 2026-09-13, segunda corrección] Mismo motivo y
 * mecanismo que AppMenu (ver su comentario).
 */
@Component({
  selector: "app-popover",
  imports: [],
  template: `
    <span #trigger class="app-popover-trigger" (click)="toggle()">
      <ng-content select="[appPopoverTrigger]" />
    </span>
    <ng-template #panelTpl>
      <div class="dropdown-menu show app-popover-panel" [class]="styleClass()">
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .app-popover-trigger {
        display: inline-block;
      }
      .app-popover-panel {
        flex: 0 0 auto;
        width: max-content;
        max-width: min(90vw, 20rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppPopover extends PopoverBase {
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
      this.hide();
    } else {
      this.openPanel();
    }
  }

  show(): void {
    if (!this.overlayRef) {
      this.openPanel();
    }
  }

  hide(): void {
    this.dispose();
  }

  private openPanel(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger())
      .withFlexibleDimensions(false)
      .withViewportMargin(20)
      .withPositions([
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top",
          offsetY: 4,
        },
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
          offsetY: 4,
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom",
          offsetY: -4,
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: this.dismissable(),
      backdropClass: "cdk-overlay-transparent-backdrop",
    });
    if (this.dismissable()) {
      this.overlayRef.backdropClick().subscribe(() => this.hide());
    }
    this.overlayRef.attach(new TemplatePortal(this.panelTpl(), this.vcr));
  }

  private dispose(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
