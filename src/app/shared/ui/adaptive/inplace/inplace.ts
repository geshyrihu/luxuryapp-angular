import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { InplaceBase } from "@ui/base/inplace.base";
import { MobileInplace } from "@ui/mobile/inplace/inplace";
import { AppInplace } from "@ui/web/inplace/inplace";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-inplace",

  imports: [NgTemplateOutlet, AppInplace, MobileInplace],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-inplace [(active)]="active" [closable]="closable()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-inplace>
    } @else {
      <app-inplace [(active)]="active" [closable]="closable()">
        <ng-container [ngTemplateOutlet]="projected" />
      </app-inplace>
    }
  `,
})
export class LxInplace extends InplaceBase {
  protected platform = inject(PlatformService);
}
