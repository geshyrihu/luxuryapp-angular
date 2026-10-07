import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { PanelBase } from "@ui/core/panel.base";
import { IliPanel } from "@ui/mobile/panel/panel";
import { AppPanel } from "@ui/web/panel/panel";

@Component({
  selector: "lux-panel",

  imports: [NgTemplateOutlet, AppPanel, IliPanel],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <lux-panel-mobile [header]="header()">
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-panel-mobile>
    } @else {
      <lux-panel-web [header]="header()">
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-panel-web>
    }
  `,
})
export class LxPanel extends PanelBase {
  protected platform = inject(PlatformService);
}
