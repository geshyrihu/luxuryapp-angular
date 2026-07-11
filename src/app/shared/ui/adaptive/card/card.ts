import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CardBase } from "@ui/base/card.base";
import { MobileCard } from "@ui/mobile/card/card";
import { AppCard } from "@ui/web/card/card";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-card",

  imports: [NgTemplateOutlet, AppCard, MobileCard],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-card>
    } @else {
      <app-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-card>
    }
  `,
})
export class LxCard extends CardBase {
  protected platform = inject(PlatformService);
}
