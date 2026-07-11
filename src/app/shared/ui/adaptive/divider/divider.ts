import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";
import { IliDivider } from "@ui/mobile/divider/divider";
import { AppDivider } from "@ui/web/divider/divider";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-divider",

  imports: [NgTemplateOutlet, AppDivider, IliDivider],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-divider [layout]="layout()"
        ><ng-container [ngTemplateOutlet]="projected"
      /></ili-divider>
    } @else {
      <app-divider [layout]="layout()"
        ><ng-container [ngTemplateOutlet]="projected"
      /></app-divider>
    }
  `,
})
export class LxDivider extends DividerBase {
  protected platform = inject(PlatformService);
}
