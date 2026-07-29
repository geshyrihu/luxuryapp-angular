import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SidebarBase } from "@ui/base/sidebar.base";
import { MobileSidebar } from "@ui/mobile/sidebar/sidebar";
import { Sidebar } from "@ui/web/sidebar/sidebar";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-sidebar",

  imports: [NgTemplateOutlet, Sidebar, MobileSidebar],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-sidebar
        [(visible)]="visible"
        [position]="position()"
        [closable]="closable()"
        [header]="header()"
        [styleClass]="styleClass()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-sidebar>
    } @else {
      <app-sidebar
        [(visible)]="visible"
        [position]="position()"
        [closable]="closable()"
        [header]="header()"
        [styleClass]="styleClass()"
        (dismiss)="dismiss.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-sidebar>
    }
  `,
})
export class LxSidebar extends SidebarBase {
  protected platform = inject(PlatformService);
}
