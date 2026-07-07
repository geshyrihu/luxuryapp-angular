import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { StepperBase } from "@ui/base/stepper.base";

@Component({
  selector: "ili-stepper",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <div class="ili-stepper">
      <div class="ili-stepper-steps">
        @for (step of steps(); track step.value) {
          <div
            class="ili-stepper-step"
            [class.ili-stepper-active]="activeStep() === step.value"
            [class.ili-stepper-completed]="step.value < activeStep()"
          >
            <div class="ili-stepper-indicator">
              @if (step.value < activeStep()) {
                <app-icon icon="mdi:check" />
              } @else {
                <span>{{ step.value }}</span>
              }
            </div>
            @if (step.icon) {
              <app-icon [icon]="step.icon" class="ili-stepper-step-icon" />
            }
            <span class="ili-stepper-step-label">{{ step.label }}</span>
          </div>
        }
      </div>
      <div class="ili-stepper-body">
        <ng-content />
      </div>
      <div class="ili-stepper-actions">
        @if (activeStep() > 1) {
          <ion-button fill="clear" color="medium" (click)="previous()">
            <app-icon icon="mdi:arrow-left" slot="start" />
            Anterior
          </ion-button>
        }
        @if (activeStep() < lastStep) {
          <ion-button (click)="next()">
            Siguiente
            <app-icon icon="mdi:arrow-right" slot="end" />
          </ion-button>
        } @else {
          <ion-button color="success" (click)="finish.emit()">
            <app-icon icon="mdi:check" slot="start" />
            {{ finishLabel() }}
          </ion-button>
        }
      </div>
    </div>
  `,
  styles: [`
    .ili-stepper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .ili-stepper-steps {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.5rem 0;
      scrollbar-width: none;
    }
    .ili-stepper-steps::-webkit-scrollbar { display: none; }
    .ili-stepper-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      min-width: 60px;
      flex-shrink: 0;
      opacity: 0.5;
    }
    .ili-stepper-active {
      opacity: 1;
    }
    .ili-stepper-active .ili-stepper-indicator {
      background: var(--ds-primary, #003d9b);
      color: #ffffff;
    }
    .ili-stepper-completed {
      opacity: 0.8;
    }
    .ili-stepper-completed .ili-stepper-indicator {
      background: var(--ds-success, #2e7d32);
      color: #ffffff;
    }
    .ili-stepper-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--ds-radius-full, 9999px);
      background: var(--ds-border, #e2e8f0);
      color: var(--ds-text-secondary);
      font-size: 0.75rem;
      font-weight: 700;
    }
    .ili-stepper-step-icon {
      font-size: 1rem;
      color: var(--ds-text-secondary);
    }
    .ili-stepper-step-label {
      font-size: 0.65rem;
      font-weight: 500;
      color: var(--ds-text-secondary);
      text-align: center;
      white-space: nowrap;
    }
    .ili-stepper-body {
      min-height: 150px;
    }
    .ili-stepper-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileStepper extends StepperBase {}
