import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { InputGroupBase } from "@ui/base/input-group.base";
import { MobileInputGroup } from "@ui/mobile/input-group/input-group";
import { AppInputGroup } from "@ui/web/input-group/input-group";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-input-group",

  imports: [NgTemplateOutlet, AppInputGroup, MobileInputGroup],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-input-group
        [addonBefore]="addonBefore()"
        [addonAfter]="addonAfter()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-input-group>
    } @else {
      <app-input-group
        [addonBefore]="addonBefore()"
        [addonAfter]="addonAfter()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-input-group>
    }
  `,
})
export class LxInputGroup extends InputGroupBase {
  protected platform = inject(PlatformService);
}
