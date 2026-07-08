import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from "@angular/core";

@Directive({
  selector: "[appFocusTrap]",
})
export class FocusTrap {
  active = input(true);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      effect(() => {
        if (this.active()) {
          this.trap();
        }
      });
    });
  }

  private trap(): void {
    const el = this.el.nativeElement;
    const focusable = this.getFocusable(el);
    if (focusable.length === 0) return;
    focusable[0].focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", handler);
  }

  private getFocusable(el: HTMLElement): HTMLElement[] {
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(el.querySelectorAll<HTMLElement>(selector));
  }
}
