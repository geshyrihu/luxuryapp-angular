import { Directive, ElementRef, inject, AfterViewInit, DestroyRef } from "@angular/core";
import { AnimateOnScrollBase } from "@ui/base/animate-on-scroll.base";

@Directive({
  selector: "[iliAnimateOnScroll]",
  standalone: true,
})
export class MobileAnimateOnScroll extends AnimateOnScrollBase implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const el = this.el.nativeElement;
          el.classList.add(`lx-animate-${this.animation()}`);
          el.style.animationDelay = `${this.delay()}ms`;
          observer.unobserve(el);
        }
      },
      { threshold: this.threshold() }
    );
    observer.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
