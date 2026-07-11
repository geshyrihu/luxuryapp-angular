import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
} from "@angular/core";
import { StyleClassBase } from "@ui/base/style-class.base";
import { StyleClassModule } from "primeng/styleclass";

@Directive({
  selector: "[appStyleClass]",
})
export class AppStyleClass extends StyleClassBase {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  override enterClass = input<string>("");
  override leaveClass = input<string>("");
  override hideOnOutsideClick = input<boolean>(false);
  override toggleClass = input<string>("");

  private isToggled = false;

  @HostListener("click")
  toggle(): void {
    this.isToggled = !this.isToggled;
    const el = this.el.nativeElement;
    if (this.isToggled) {
      if (this.enterClass()) this.renderer.addClass(el, this.enterClass());
      if (this.leaveClass()) this.renderer.removeClass(el, this.leaveClass());
      if (this.toggleClass()) this.renderer.addClass(el, this.toggleClass());
    } else {
      if (this.enterClass()) this.renderer.removeClass(el, this.enterClass());
      if (this.leaveClass()) this.renderer.addClass(el, this.leaveClass());
      if (this.toggleClass()) this.renderer.removeClass(el, this.toggleClass());
    }
  }
}
