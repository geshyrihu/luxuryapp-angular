import { Component, inject } from "@angular/core";
import { DockBase } from "@ui/base/dock.base";
import { MobileDock } from "@ui/mobile/dock/dock";
import { AppDock } from "@ui/web/dock/dock";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-dock",

  imports: [AppDock, MobileDock],
  template: `
    @if (platform.isMobile()) {
      <ili-dock
        [items]="items()"
        [position]="position()"
        (itemClick)="itemClick.emit($event)"
      />
    } @else {
      <app-dock
        [items]="items()"
        [position]="position()"
        (itemClick)="itemClick.emit($event)"
      />
    }
  `,
})
export class LxDock extends DockBase {
  protected platform = inject(PlatformService);
}
