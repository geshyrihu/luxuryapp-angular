import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { FieldsetBase } from "@ui/core/fieldset.base";
import { IliFieldset } from "@ui/mobile/fieldset/fieldset";
import { AppFieldset } from "@ui/web/fieldset/fieldset";

@Component({
  selector: "lux-fieldset",

  imports: [NgTemplateOutlet, AppFieldset, IliFieldset],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <lux-fieldset-mobile [legend]="legend()">
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-fieldset-mobile>
    } @else {
      <lux-fieldset-web
        [legend]="legend()"
        [toggleable]="toggleable()"
        [collapsed]="collapsed()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-fieldset-web>
    }
  `,
})
export class LxFieldset extends FieldsetBase {
  protected platform = inject(PlatformService);
}
