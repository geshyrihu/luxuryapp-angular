import { Component, contentChildren, input, model, output, signal, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { StepperModule } from "primeng/stepper";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

export interface WizardStep {
  value: number;
  label: string;
  icon: string;
}

@Component({
  selector: "app-wizard",
  standalone: true,
  imports: [CommonModule, ButtonModule, StepperModule, AppIcon],
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
              <div class="wizard-body p-3 surface-ground border-round">
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
  styles: [`
    :host { display: block; }
    .wizard-body { min-height: 200px; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Wizard {
  steps = input.required<WizardStep[]>();
  linear = input<boolean>(true);
  finishLabel = input("Finalizar");
  activeStep = model<number>(1);
  finish = output<void>();

  get lastStep(): number {
    return this.steps().length;
  }

  next(): void {
    const next = this.activeStep() + 1;
    if (next <= this.lastStep) {
      this.activeStep.set(next);
    }
  }

  previous(): void {
    const prev = this.activeStep() - 1;
    if (prev >= 1) {
      this.activeStep.set(prev);
    }
  }
}
