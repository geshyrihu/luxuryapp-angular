import { Directive, OnDestroy, signal } from "@angular/core";

@Directive()
export abstract class OfflineIndicatorBase implements OnDestroy {
  online = signal(navigator.onLine);
  showBanner = signal(false);
  protected timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    window.addEventListener("online", () => this.updateStatus(true));
    window.addEventListener("offline", () => this.updateStatus(false));
  }

  protected updateStatus(isOnline: boolean): void {
    this.online.set(isOnline);
    this.showBanner.set(true);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.showBanner.set(false), isOnline ? 3000 : 0);
  }

  ngOnDestroy(): void {
    window.removeEventListener("online", () => {});
    window.removeEventListener("offline", () => {});
  }
}
