import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppSteps } from "@ui/web/steps/steps";
import { MobileSteps } from "@ui/mobile/steps/steps";
import { StepsBase } from "@ui/base/steps.base";

@Component({
  selector: "lx-steps",
  standalone: true,
  imports: [AppSteps, MobileSteps],
  template: `
    @if (platform.isMobile()) {
      <ili-steps [model]="model()" [readonly]="readonly()" [activeIndex]="activeIndex()" (activeIndexChange)="activeIndex.set($event)" [styleClass]="styleClass()"></ili-${c.folder}>
    } @else {
      <app-steps [model]="model()" [readonly]="readonly()" [activeIndex]="activeIndex()" (activeIndexChange)="activeIndex.set($event)" [styleClass]="styleClass()"></app-${c.folder}>
    }
  `,
})
export class LxSteps extends StepsBase {
  protected platform = inject(PlatformService);
}
