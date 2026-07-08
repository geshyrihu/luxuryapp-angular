import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
} from "@angular/core";
import { AnimateOnScrollBase } from "@ui/base/animate-on-scroll.base";
import { PlatformService } from "src/app/core/services/platform.service";

@Directive({
  selector: "[lxAnimateOnScroll]",
})
export class LxAnimateOnScroll
  extends AnimateOnScrollBase
  implements AfterViewInit
{
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  protected platform = inject(PlatformService);

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
      { threshold: this.threshold() },
    );
    observer.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
