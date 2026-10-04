import { Directive, output, signal } from "@angular/core";

@Directive()
export abstract class PullToRefreshBase {
  refresh = output<void>();

  pullDistance = signal(0);
  pulling = signal(false);
  refreshing = signal(false);
  protected startY = 0;
  protected threshold = 60;

  onTouchStart(event: TouchEvent): void {
    const scrollTop = (event.target as HTMLElement)?.closest(".ptr-root")?.scrollTop || window.scrollY;
    if (scrollTop <= 0) {
      this.startY = event.touches[0].clientY;
      this.pulling.set(true);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.pulling()) return;
    const dist = Math.max(0, event.touches[0].clientY - this.startY);
    this.pullDistance.set(Math.min(dist * 0.5, this.threshold * 1.5));
  }

  onTouchEnd(): void {
    if (!this.pulling()) return;
    if (this.pullDistance() >= this.threshold) {
      this.refreshing.set(true);
      this.refresh.emit();
    }
    this.pulling.set(false);
    this.pullDistance.set(0);
    setTimeout(() => this.refreshing.set(false), 2000);
  }
}
