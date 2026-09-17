import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { StepperBase } from "@ui/base/stepper.base";
import { MobileStepper } from "@ui/mobile/stepper/stepper";
import { PlatformService } from "@core/services/platform.service";

@Component({
  selector: "lx-stepper",

  imports: [NgTemplateOutlet, MobileStepper],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-stepper
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-stepper>
    } @else {
      <ili-stepper
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
      ><ng-container [ngTemplateOutlet]="projected" /></ili-stepper>
    }
  `,
})
export class LxStepper extends StepperBase {
  protected platform = inject(PlatformService);
}
