import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import type { StepperStep } from "@ui/base/stepper.base";
import { StepperBase } from "@ui/base/stepper.base";
import { ButtonModule } from "primeng/button";
import { StepperModule } from "primeng/stepper";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export type WizardStep = StepperStep;

@Component({
  selector: "app-wizard",

  imports: [ButtonModule, StepperModule, AppIcon],
  template: `
    <p-stepper [(value)]="activeStep" [linear]="linear()">
      <p-step-list>
        @for (step of steps(); track step.value) {
          <p-step [value]="step.value">
            <div class="flex align-items-center gap-1">
              <app-icon [icon]="step.icon" class="text-sm" />
              <span>{{ step.label }}</span>
            </div>
          </p-step>
        }
      </p-step-list>
      <p-step-panels>
        @for (step of steps(); track step.value) {
          <p-step-panel [value]="step.value">
            <ng-template #content let-activateCallback="activateCallback">
              <div class="wizard-body p-3 surface-ground rounded">
                <ng-content [select]="'[step=' + step.value + ']'" />
              </div>
              <div class="flex justify-content-between mt-3">
                @if (step.value > 1) {
                  <p-button
                    label="Anterior"
                    icon="mdi:arrow-left"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="previous()"
                  />
                } @else {
                  <div></div>
                }
                @if (step.value < lastStep()) {
                  <p-button
                    label="Siguiente"
                    icon="mdi:arrow-right"
                    iconPos="right"
                    (onClick)="next()"
                  />
                } @else {
                  <p-button
                    [label]="finishLabel()"
                    icon="mdi:check"
                    iconPos="right"
                    severity="success"
                    (onClick)="finish.emit()"
                  />
                }
              </div>
            </ng-template>
          </p-step-panel>
        }
      </p-step-panels>
    </p-stepper>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .wizard-body {
        min-height: 200px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Wizard extends StepperBase {}
