import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Wizard } from "@ui/web/wizard/wizard";
import { MobileStepper } from "@ui/mobile/stepper/stepper";
import { StepperBase } from "@ui/base/stepper.base";

@Component({
  selector: "lx-stepper",
  standalone: true,
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
