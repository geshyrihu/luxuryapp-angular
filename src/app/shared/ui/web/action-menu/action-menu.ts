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
import { AppIcon } from "@ui/shared/app-icon/app-icon";

/** Web action menu rendered in a CDK overlay. */
@Component({
  selector: "app-action-menu",
  imports: [AppIcon],
  template: `
    <div class="action-menu">
      <button
        #actionMenuButton
        type="button"
        class="rounded-lg action-menu-button"
        (click)="toggle()"
        [attr.aria-expanded]="isOpen"
        aria-label="Opciones"
      >
        <app-icon icon="material-symbols-light:more-vert" class="text-xl" />
      </button>

      <ng-template #panelTpl>
        <div class="menu-container" (click)="closeMenu()">
          <ng-content></ng-content>
        </div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .menu-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.375rem;
        min-width: 180px;
        position: relative;
        z-index: 1;
        background-color: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        box-shadow: var(--ds-shadow-lg);
      }
      .menu-container button {
        width: 100%;
        justify-content: flex-start;
      }
      @media (max-width: 767px) {
        .menu-container {
          min-width: 200px;
          gap: 0.125rem;
          padding: 0.25rem;
        }
      }
    `,
  ],
})
export class ActionMenu {
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private trigger = viewChild.required<ElementRef<HTMLElement>>("actionMenuButton");
  private panelTpl = viewChild.required<TemplateRef<unknown>>("panelTpl");
  private overlayRef?: OverlayRef;

  get isOpen(): boolean {
    return !!this.overlayRef;
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  toggle(): void {
    if (this.overlayRef) {
      this.close();
    } else {
      this.openPanel();
    }
  }

  closeMenu(): void {
    setTimeout(() => this.close(), 60);
  }

  close(): void {
    this.dispose();
  }

  private openPanel(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger())
      .withFlexibleDimensions(false)
      .withPush(true)
      .withViewportMargin(8)
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
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: true,
      backdropClass: "cdk-overlay-transparent-backdrop",
    });
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });
    this.overlayRef.attach(new TemplatePortal(this.panelTpl(), this.vcr));
  }

  private dispose(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
