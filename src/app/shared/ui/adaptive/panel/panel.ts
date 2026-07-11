import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PanelBase } from "@ui/base/panel.base";
import { IliPanel } from "@ui/mobile/panel/panel";
import { AppPanel } from "@ui/web/panel/panel";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-panel",

  imports: [NgTemplateOutlet, AppPanel, IliPanel],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-panel [header]="header()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-panel>
    } @else {
      <app-panel [header]="header()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-panel>
    }
  `,
})
export class LxPanel extends PanelBase {
  protected platform = inject(PlatformService);
}
