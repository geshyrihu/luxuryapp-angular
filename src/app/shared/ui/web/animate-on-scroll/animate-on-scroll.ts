import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import { AnimateOnScrollBase } from "@ui/base/animate-on-scroll.base";
import { AnimateOnScrollModule } from "primeng/animateonscroll";

@Directive({
  selector: "[appAnimateOnScroll]",
})
export class AppAnimateOnScroll
  extends AnimateOnScrollBase
  implements AfterViewInit
{
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  override animation = input<string>("fadeIn");
  override delay = input<number>(0);
  override threshold = input<number>(0.1);

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
