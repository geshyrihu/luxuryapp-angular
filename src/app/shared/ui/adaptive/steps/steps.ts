import { Component, inject } from "@angular/core";
import { StepsBase } from "@ui/base/steps.base";
import { MobileSteps } from "@ui/mobile/steps/steps";
import { AppSteps } from "@ui/web/steps/steps";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-steps",

  imports: [AppSteps, MobileSteps],
  template: `
    @if (platform.isMobile()) {
      <ili-steps
        [model]="model()"
        [readonly]="readonly()"
        [activeIndex]="activeIndex()"
        (activeIndexChange)="activeIndex.set($event)"
        [styleClass]="styleClass()"
      ></ili-steps>
    } @else {
      <app-steps
        [model]="model()"
        [readonly]="readonly()"
        [activeIndex]="activeIndex()"
        (activeIndexChange)="activeIndex.set($event)"
        [styleClass]="styleClass()"
      ></app-steps>
    }
  `,
})
export class LxSteps extends StepsBase {
  protected platform = inject(PlatformService);
}
