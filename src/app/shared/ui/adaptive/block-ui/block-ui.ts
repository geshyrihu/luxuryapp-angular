import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { BlockUIBase } from "@ui/base/block-ui.base";
import { MobileBlockUI } from "@ui/mobile/block-ui/block-ui";
import { AppBlockUI } from "@ui/web/block-ui/block-ui";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-block-ui",

  imports: [NgTemplateOutlet, AppBlockUI, MobileBlockUI],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-block-ui [blocked]="blocked()" [fullScreen]="fullScreen()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-block-ui>
    } @else {
      <app-block-ui [blocked]="blocked()" [fullScreen]="fullScreen()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-block-ui>
    }
  `,
})
export class LxBlockUI extends BlockUIBase {
  protected platform = inject(PlatformService);
}
