import { CommonModule } from "@angular/common";
import { Component, input, ViewEncapsulation } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonNote } from "@ionic/angular/standalone";
import { BaseInputSignal } from "./base-input-signal";

@Component({
  selector: "base-ionic-input",
  imports: [CommonModule, ReactiveFormsModule, IonNote],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (!hidden()) {
      @if (onlyInput()) {
        <div class="fluid">
          <ng-content></ng-content>
        </div>
      } @else {
        <div class="field" [class.field-horizontal]="horizontal()" [class.mb-0]="noMargin()">
          @if (label() && !ionicLabel()) {
            <label [for]="id()" class="field-label">
              {{ label() }}
              @if (isRequired()) {
                <span style="color:var(--ds-danger)">*</span>
              }
            </label>
          }
          <div class="field-content">
            <ng-content></ng-content>
            @if (description()) {
              <ion-note color="medium" class="description-note">
                <small>{{ description() }}</small>
              </ion-note>
            }
            @if (shouldShowErrors()) {
              <div class="error-container">
                @for (error of getValidationErrors(); track error) {
                  <ion-note color="danger">
                    <small>{{ error }}</small>
                  </ion-note>
                }
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
      }
      .field.mb-0 {
        margin-bottom: 0 !important;
      }
      .field-horizontal {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 1rem;
        align-items: start;
      }
      .field-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      .field-horizontal .field-label {
        margin-bottom: 0;
        padding-top: 0.5rem;
      }
      .field-content {
        width: 100%;
      }
      .fluid {
        width: 100%;
      }
      @media (max-width: 768px) {
        .field-horizontal {
          grid-template-columns: 1fr;
        }
      }
      ion-input,
      ion-textarea,
      ion-select {
        --border-radius: var(--ds-radius-input, 8px);
        --border-width: var(--ds-control-border-width, 1.5px);
        --border-color: var(--ds-border-input, #94a3b8);
        --border-style: solid;
        --background: var(--ds-bg-surface, #ffffff);
        --box-shadow: none;
        --padding-start: 0.75rem;
        --padding-end: 0.75rem;
        --padding-top: 0.5rem;
        --padding-bottom: 0.5rem;
        --highlight-color-focused: var(--ds-border-focus, #0b3164);
        --highlight-color-invalid: var(--ds-border-error, #ef4444);
        --placeholder-color: var(--ds-text-muted, #6b7280);
        --placeholder-opacity: 1;
        margin-bottom: 0px;
        font-size: var(--ds-font-size-label, 0.875rem);
        transition: border-color 150ms ease;
        min-height: 44px;
        width: 100%;
      }
      ion-input.ion-focused,
      ion-textarea.ion-focused,
      ion-select.ion-focused {
        --border-color: var(--ds-border-focus, #0b3164) !important;
        --box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-border-focus) 20%, transparent);
        outline: none;
      }
      ion-input.ion-invalid.ion-touched,
      ion-textarea.ion-invalid.ion-touched,
      ion-select.ion-invalid.ion-touched {
        --border-color: var(--ds-border-error, #ef4444) !important;
      }
      ion-input.ion-invalid.ion-focused,
      ion-textarea.ion-invalid.ion-focused,
      ion-select.ion-invalid.ion-focused {
        --box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-border-error) 20%, transparent);
      }
      ion-input.ion-disabled,
      ion-textarea.ion-disabled,
      ion-select.ion-disabled {
        opacity: 0.55;
        --background: var(--ds-bg-sunken, #f1f5f9);
        cursor: not-allowed;
      }
      ion-note {
        display: block;
        font-size: 0.75rem;
        margin-top: 4px;
        margin-left: 12px;
      }
      .description-note {
        margin-top: 6px;
        margin-left: 12px;
        font-style: italic;
        color: var(--ds-text-muted, #6b7280);
      }
    `,
  ],
})
export class BaseIonicInput extends BaseInputSignal {
  readonly ionicLabel = input<boolean>(true);

  shouldShowErrors(): boolean {
    const ctrl = this.control() || this.internalControl;
    return ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getValidationErrors(): string[] {
    const ctrl = this.control() || this.internalControl;
    return Object.keys(ctrl?.errors || {}).map((key: string) => {
      const label = this.placeholder() || (this.label() as string) || "Campo";
      switch (key) {
        case "required":
          return `${label} es requerido.`;
        case "minlength":
          return `Mínimo ${ctrl.errors.minlength.requiredLength} caracteres.`;
        case "maxlength":
          return `Máximo ${ctrl.errors.maxlength.requiredLength} caracteres.`;
        case "min":
          return `Valor mínimo: ${ctrl.errors[key].min}`;
        case "max":
          return `Valor máximo: ${ctrl.errors[key].max}`;
        case "email":
          return "Email inválido.";
        case "pattern":
          return `Formato de ${label} inválido.`;
        case "customError":
          return `${ctrl.errors[key]}`;
        default:
          return `Error: ${key}`;
      }
    });
  }
}
