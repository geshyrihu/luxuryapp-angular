import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Accordion } from "@ui/web/accordion/accordion";
import { MobileAccordion } from "@ui/mobile/accordion/accordion";
import { AccordionBase } from "@ui/base/accordion.base";

@Component({
  selector: "lx-accordion",
  standalone: true,
  imports: [Accordion, MobileAccordion],
  template: `
    @if (platform.isMobile()) {
      <ili-accordion [items]="items()" [multiple]="multiple()" [(expandedIds)]="expandedIds">
        <ng-content />
      </ili-accordion>
    } @else {
      <app-accordion [items]="items()" [multiple]="multiple()" [(expandedIds)]="expandedIds">
        <ng-content />
      </app-accordion>
    }
  `,
})
export class LxAccordion extends AccordionBase {
  protected platform = inject(PlatformService);
}
