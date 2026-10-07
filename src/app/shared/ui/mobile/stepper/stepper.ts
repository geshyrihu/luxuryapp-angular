import { Component, ViewEncapsulation } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { StepperBase } from "@ui/core/stepper.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-stepper-mobile",

  imports: [IonButton, AppIconMobile],
  template: `
    <div class="lux-stepper-mobile">
      <div class="lux-stepper-mobile-steps">
        @for (step of steps(); track step.value) {
          <div
            class="lux-stepper-mobile-step"
            [class.lux-stepper-mobile-active]="activeStep() === step.value"
            [class.lux-stepper-mobile-completed]="step.value < activeStep()"
          >
            <div class="lux-stepper-mobile-indicator">
              @if (step.value < activeStep()) {
                <lux-icon-mobile icon="material-symbols-light:check" />
              } @else {
                <span>{{ step.value }}</span>
              }
            </div>
            @if (step.icon) {
              <lux-icon-mobile [icon]="step.icon" class="lux-stepper-mobile-step-icon" />
            }
            <span class="lux-stepper-mobile-step-label">{{ step.label }}</span>
          </div>
        }
      </div>
      <div class="lux-stepper-mobile-body">
        <ng-content />
      </div>
      <div class="lux-stepper-mobile-actions">
        @if (activeStep() > 1) {
          <ion-button fill="clear" color="medium" (click)="previous()">
            <lux-icon-mobile icon="material-symbols-light:arrow-back" slot="start" />
            Anterior
          </ion-button>
        }
        @if (activeStep() < lastStep()) {
          <ion-button (click)="next()">
            Siguiente
            <lux-icon-mobile icon="material-symbols-light:arrow-forward" slot="end" />
          </ion-button>
        } @else {
          <ion-button color="success" (click)="finish.emit()">
            <lux-icon-mobile icon="material-symbols-light:check" slot="start" />
            {{ finishLabel() }}
          </ion-button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .lux-stepper-mobile {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .lux-stepper-mobile-steps {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        overflow-x: auto;
        padding: 0.5rem 0;
        scrollbar-width: none;
      }
      .lux-stepper-mobile-steps::-webkit-scrollbar {
        display: none;
      }
      .lux-stepper-mobile-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        min-width: 60px;
        flex-shrink: 0;
        opacity: 0.5;
      }
      .lux-stepper-mobile-active {
        opacity: 1;
      }
      .lux-stepper-mobile-active .lux-stepper-mobile-indicator {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      .lux-stepper-mobile-completed {
        opacity: 0.8;
      }
      .lux-stepper-mobile-completed .lux-stepper-mobile-indicator {
        background: var(--ds-success);
        color: var(--ds-on-primary);
      }
      .lux-stepper-mobile-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--ds-radius-full);
        background: var(--ds-border);
        color: var(--ds-text-secondary);
        font-size: 0.75rem;
        font-weight: 700;
      }
      .lux-stepper-mobile-step-icon {
        font-size: 1rem;
        color: var(--ds-text-secondary);
      }
      .lux-stepper-mobile-step-label {
        font-size: 0.65rem;
        font-weight: 500;
        color: var(--ds-text-secondary);
        text-align: center;
        white-space: nowrap;
      }
      .lux-stepper-mobile-body {
        min-height: 150px;
      }
      .lux-stepper-mobile-actions {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
      }
    `,
    `
      :host ::ng-deep [step] {
        display: none;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileStepper extends StepperBase {}

