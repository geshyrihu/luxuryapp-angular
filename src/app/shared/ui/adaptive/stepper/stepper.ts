import { Component, inject } from "@angular/core";
import { StepperBase } from "@ui/base/stepper.base";
import { MobileStepper } from "@ui/mobile/stepper/stepper";
import { Wizard } from "@ui/web/wizard/wizard";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-stepper",

  imports: [Wizard, MobileStepper],
  template: `
    @if (platform.isMobile()) {
      <ili-stepper
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
      >
        <ng-content />
      </ili-stepper>
    } @else {
      <app-wizard
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
      >
        <ng-content />
      </app-wizard>
    }
  `,
})
export class LxStepper extends StepperBase {
  protected platform = inject(PlatformService);
}
