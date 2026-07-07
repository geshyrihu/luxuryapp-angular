import { Directive, HostListener, inject } from "@angular/core";
import { ViewportScroller } from "@angular/common";

@Directive()
export abstract class TapToTopBase {
  protected viewScroller = inject(ViewportScroller);
  show = false;

  @HostListener("window:scroll", [])
  onWindowScroll(): void {
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.show = number > 600;
  }

  tapToTop(): void {
    this.viewScroller.scrollToPosition([0, 0]);
  }
}
