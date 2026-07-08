import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from "@angular/core";
import { StyleClassBase } from "@ui/base/style-class.base";

@Directive({
  selector: "[iliStyleClass]",
})
export class MobileStyleClass extends StyleClassBase {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  private isToggled = false;

  @HostListener("click")
  toggle(): void {
    this.isToggled = !this.isToggled;
    const el = this.el.nativeElement;
    if (this.isToggled) {
      if (this.enterClass()) this.renderer.addClass(el, this.enterClass());
      if (this.toggleClass()) this.renderer.addClass(el, this.toggleClass());
      if (this.leaveClass()) this.renderer.removeClass(el, this.leaveClass());
    } else {
      if (this.enterClass()) this.renderer.removeClass(el, this.enterClass());
      if (this.toggleClass()) this.renderer.removeClass(el, this.toggleClass());
      if (this.leaveClass()) this.renderer.addClass(el, this.leaveClass());
    }
  }
}
