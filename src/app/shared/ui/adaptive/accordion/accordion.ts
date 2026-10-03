import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { AccordionBase } from "@ui/base/accordion.base";
import { MobileAccordion } from "@ui/mobile/accordion/accordion";
import { Accordion } from "@ui/web/accordion/accordion";

@Component({
  selector: "lux-accordion",
  imports: [NgTemplateOutlet, Accordion, MobileAccordion],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-accordion
        [items]="items()"
        [multiple]="multiple()"
        [(expandedIds)]="expandedIds"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-accordion>
    } @else {
      <app-accordion
        [items]="items()"
        [multiple]="multiple()"
        [(expandedIds)]="expandedIds"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-accordion>
    }
  `,
})
export class LxAccordion extends AccordionBase {
  protected platform = inject(PlatformService);
}
