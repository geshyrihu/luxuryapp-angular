import { Component, inject } from "@angular/core";
import { SidebarBase } from "@ui/base/sidebar.base";
import { MobileSidebar } from "@ui/mobile/sidebar/sidebar";
import { Sidebar } from "@ui/web/sidebar/sidebar";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-sidebar",

  imports: [Sidebar, MobileSidebar],
  template: `
    @if (platform.isMobile()) {
      <ili-sidebar
        [(visible)]="visible"
        [position]="position()"
        [closable]="closable()"
        [header]="header()"
        (dismiss)="dismiss.emit()"
      >
        <ng-content />
      </ili-sidebar>
    } @else {
      <app-sidebar
        [(visible)]="visible"
        [position]="position()"
        [closable]="closable()"
        [header]="header()"
        (dismiss)="dismiss.emit()"
      >
        <ng-content />
      </app-sidebar>
    }
  `,
})
export class LxSidebar extends SidebarBase {
  protected platform = inject(PlatformService);
}
