import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { StepsBase } from "@ui/core/steps.base";
import { MobileSteps } from "@ui/mobile/steps/steps";
import { AppSteps } from "@ui/web/steps/steps";

@Component({
  selector: "lux-steps",

  imports: [AppSteps, MobileSteps],
  template: `
    @if (platform.isMobile()) {
      <lux-steps-mobile
        [model]="model()"
        [readonly]="readonly()"
        [activeIndex]="activeIndex()"
        (activeIndexChange)="activeIndex.set($event)"
        [styleClass]="styleClass()"
      ></lux-steps-mobile>
    } @else {
      <lux-steps-web
        [model]="model()"
        [readonly]="readonly()"
        [activeIndex]="activeIndex()"
        (activeIndexChange)="activeIndex.set($event)"
        [styleClass]="styleClass()"
      ></lux-steps-web>
    }
  `,
})
export class LxSteps extends StepsBase {
  protected platform = inject(PlatformService);
}
