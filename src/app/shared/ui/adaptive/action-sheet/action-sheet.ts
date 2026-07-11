import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-action-sheet",

  imports: [NgTemplateOutlet, ActionMenu, MobileActionMenu],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-action-menu><ng-container [ngTemplateOutlet]="projected" /></ili-action-menu>
    } @else {
      <app-action-menu><ng-container [ngTemplateOutlet]="projected" /></app-action-menu>
    }
  `,
})
export class LxActionSheet {
  protected platform = inject(PlatformService);
}
