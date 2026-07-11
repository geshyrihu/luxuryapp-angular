import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FieldsetBase } from "@ui/base/fieldset.base";
import { IliFieldset } from "@ui/mobile/fieldset/fieldset";
import { AppFieldset } from "@ui/web/fieldset/fieldset";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-fieldset",

  imports: [NgTemplateOutlet, AppFieldset, IliFieldset],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-fieldset [legend]="legend()">
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-fieldset>
    } @else {
      <app-fieldset
        [legend]="legend()"
        [toggleable]="toggleable()"
        [collapsed]="collapsed()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-fieldset>
    }
  `,
})
export class LxFieldset extends FieldsetBase {
  protected platform = inject(PlatformService);
}
