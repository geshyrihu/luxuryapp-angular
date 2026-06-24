import { Component, computed, OnDestroy, signal, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-offline-indicator",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    @if (showBanner()) {
      <div class="offline-banner" [class.offline-banner-online]="online()">
        <app-icon
          [icon]="online() ? 'mdi:wifi' : 'mdi:wifi-off'"
          class="offline-icon"
        />
        <span>{{ online() ? "Conexión restaurada" : "Sin conexión" }}</span>
      </div>
    }
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--ds-danger, #ba1a1a);
      color: #fff;
      font-size: var(--ds-font-size-table, 0.875rem);
      z-index: 9999;
      transition: transform 0.3s;
    }
    .offline-banner-online {
      background: var(--ds-success, #006837);
    }
    .offline-icon {
      font-size: 1rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class OfflineIndicator implements OnDestroy {
  online = signal(navigator.onLine);
  showBanner = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    window.addEventListener("online", () => this.updateStatus(true));
    window.addEventListener("offline", () => this.updateStatus(false));
  }

  private updateStatus(isOnline: boolean): void {
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
