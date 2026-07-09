import { Component, inject } from "@angular/core";
import { ContextMenuBase } from "@ui/base/context-menu.base";
import { MobileContextMenu } from "@ui/mobile/context-menu/context-menu";
import { ContextMenu } from "@ui/web/context-menu/context-menu";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-context-menu",

  imports: [ContextMenu, MobileContextMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-context-menu [items]="items()" [(visible)]="visible" />
    } @else {
      <app-context-menu [items]="items()" [(visible)]="visible" />
    }
  `,
})
export class LxContextMenu extends ContextMenuBase {
  protected platform = inject(PlatformService);
}
