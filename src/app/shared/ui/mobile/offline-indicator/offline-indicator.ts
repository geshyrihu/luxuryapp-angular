import { Component, ViewEncapsulation } from "@angular/core";
import { OfflineIndicatorBase } from "@ui/base/offline-indicator.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-offline-indicator",

  imports: [AppIcon],
  template: `
    @if (showBanner()) {
      <div class="offline-banner" [class.offline-banner-online]="online()">
        <app-icon
          [icon]="online() ? 'material-symbols-light:wifi' : 'material-symbols-light:wifi-off'"
          class="offline-icon"
        />
        <span>{{ online() ? "Conexión restaurada" : "Sin conexión" }}</span>
      </div>
    }
  `,
  styles: [
    `
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
        background: var(--ds-danger);
        color: var(--ds-on-primary);
        font-size: var(--ds-font-size-table);
        z-index: 9999;
        transition: transform 0.3s;
      }
      .offline-banner-online {
        background: var(--ds-success);
      }
      .offline-icon {
        font-size: 1rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileOfflineIndicator extends OfflineIndicatorBase {}
