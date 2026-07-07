import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Sidebar } from "@ui/web/sidebar/sidebar";
import { MobileSidebar } from "@ui/mobile/sidebar/sidebar";
import { SidebarBase } from "@ui/base/sidebar.base";

@Component({
  selector: "lx-sidebar",
  standalone: true,
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
