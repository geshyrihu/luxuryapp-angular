import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FluidBase } from "@ui/base/fluid.base";
import { MobileFluid } from "@ui/mobile/fluid/fluid";
import { AppFluid } from "@ui/web/fluid/fluid";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-fluid",

  imports: [NgTemplateOutlet, AppFluid, MobileFluid],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-fluid>
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-fluid>
    } @else {
      <app-fluid>
        <ng-container [ngTemplateOutlet]="projected" />
      </app-fluid>
    }
  `,
})
export class LxFluid extends FluidBase {
  protected platform = inject(PlatformService);
}
