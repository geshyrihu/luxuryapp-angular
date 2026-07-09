import { Component, inject } from "@angular/core";
import { CardBase } from "@ui/base/card.base";
import { MobileCard } from "@ui/mobile/card/card";
import { AppCard } from "@ui/web/card/card";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-card",

  imports: [AppCard, MobileCard],
  template: `
    @if (platform.isMobile()) {
      <ili-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
      >
        <ng-content />
      </ili-card>
    } @else {
      <app-card
        [header]="header()"
        [subheader]="subheader()"
        [padded]="padded()"
        [elevated]="elevated()"
      >
        <ng-content />
      </app-card>
    }
  `,
})
export class LxCard extends CardBase {
  protected platform = inject(PlatformService);
}
