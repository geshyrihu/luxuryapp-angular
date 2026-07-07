import { CommonModule, ViewportScroller } from "@angular/common";
import { Component, HostListener, inject, ChangeDetectionStrategy } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

/**
 * ⬆️ TAP TO TOP
 * -------------------------------------------------------------------------
 * Botón flotante para volver arriba.
 * Aparece cuando el usuario hace scroll hacia abajo.
 */
@Component({
  selector: "app-tap-to-top",
  imports: [CommonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div
      class="tap-top text-center"
      (click)="tapToTop()"
      [ngStyle]="{ display: show ? 'block' : 'none' }"
    >
      <app-icon [icon]="'mdi:arrow-up'" class="m-0 icon icon-" />
    </div>
  `,
})
export class TapToTop {
  private viewScroller = inject(ViewportScroller);
  public show: boolean = false;

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number > 600) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  tapToTop() {
    this.viewScroller.scrollToPosition([0, 0]);
  }
}
