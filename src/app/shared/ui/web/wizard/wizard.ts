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
    </p-stepper>

    <div class="wizard-body p-3 surface-ground rounded mt-3">
      <ng-content />
    </div>

    <div class="flex justify-content-between mt-3">
      @if (activeStep() > 1) {
        <p-button
          label="Anterior"
          severity="secondary"
          [outlined]="true"
          (onClick)="previous()"
        >
          <ng-template #icon>
            <app-icon icon="material-symbols-light:arrow-back" />
          </ng-template>
        </p-button>
      } @else {
        <div></div>
      }
      @if (activeStep() < lastStep()) {
        <p-button label="Siguiente" iconPos="right" (onClick)="next()">
          <ng-template #icon>
            <app-icon icon="material-symbols-light:arrow-forward" />
          </ng-template>
        </p-button>
      } @else {
        <p-button
          [label]="finishLabel()"
          iconPos="right"
          severity="success"
          (onClick)="finish.emit()"
        >
          <ng-template #icon>
            <app-icon icon="material-symbols-light:check" />
          </ng-template>
        </p-button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .wizard-body {
        min-height: 200px;
      }
      :host ::ng-deep [step] {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Wizard extends StepperBase {}
