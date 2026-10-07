import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { StepperBase } from "@ui/core/stepper.base";
import { MobileStepper } from "@ui/mobile/stepper/stepper";

@Component({
  selector: "lux-stepper",

  imports: [NgTemplateOutlet, MobileStepper],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <lux-stepper-mobile
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-stepper-mobile>
    } @else {
      <lux-stepper-mobile
        [steps]="steps()"
        [linear]="linear()"
        [finishLabel]="finishLabel()"
        [(activeStep)]="activeStep"
        (finish)="finish.emit()"
        ><ng-container [ngTemplateOutlet]="projected"
      /></lux-stepper-mobile>
    }
  `,
})
export class LxStepper extends StepperBase {
  protected platform = inject(PlatformService);
}
