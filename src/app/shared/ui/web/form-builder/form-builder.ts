import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DividerModule } from "primeng/divider";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { ToggleSwitchModule } from "primeng/toggleswitch";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "currency"
  | "textarea"
  | "select"
  | "multiselect"
  | "date"
  | "checkbox"
  | "switch";

export interface FormField {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  options?: { label: string; value: unknown }[];
  min?: number;
  max?: number;
  rows?: number;
  colspan?: 1 | 2; // columnas que ocupa (en grid de 2)
}

export type FormValues = Record<string, unknown>;

/**
 * AppFormBuilder — Genera formularios dinámicamente desde un schema JSON.
 * Emite `formChange` con los valores actuales y `formSubmit` al enviar.
 */
@Component({
  selector: "app-form-builder",

  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    CheckboxModule,
    ToggleSwitchModule,
    DatePickerModule,
    DividerModule,
  ],
  template: `
    <form class="fb-root" (ngSubmit)="submit()">
      @if (title()) {
        <h3 class="fb-title">{{ title() }}</h3>
        <p-divider />
      }

      <div class="fb-grid">
        @for (field of schema(); track field.key) {
          <div class="fb-field" [class.fb-col-2]="field.colspan === 2">
            <label class="fb-label" [for]="field.key">
              {{ field.label }}
              @if (field.required) {
                <span class="fb-required">*</span>
              }
            </label>

            @switch (field.type) {
              @case ("text") {
                <input
                  pInputText
                  [id]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  [disabled]="field.disabled ?? false"
                  class="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("email") {
                <input
                  pInputText
                  type="email"
                  [id]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  class="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("password") {
                <input
                  pInputText
                  type="password"
                  [id]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [placeholder]="field.placeholder ?? ''"
                  class="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("number") {
                <p-inputnumber
                  [inputId]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [min]="field.min"
                  [max]="field.max"
                  [placeholder]="field.placeholder ?? ''"
                  [disabled]="field.disabled ?? false"
                  styleClass="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("currency") {
                <p-inputnumber
                  [inputId]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  mode="currency"
                  currency="MXN"
                  locale="es-MX"
                  [placeholder]="field.placeholder ?? ''"
                  styleClass="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("textarea") {
                <textarea
                  pTextarea
                  [id]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [rows]="field.rows ?? 3"
                  [placeholder]="field.placeholder ?? ''"
                  [disabled]="field.disabled ?? false"
                  class="w-full"
                  (ngModelChange)="onchange()"
                ></textarea>
              }
              @case ("select") {
                <p-select
                  [inputId]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [options]="field.options ?? []"
                  optionLabel="label"
                  optionValue="value"
                  [placeholder]="field.placeholder ?? 'Seleccionar'"
                  [disabled]="field.disabled ?? false"
                  styleClass="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("date") {
                <p-datepicker
                  [inputId]="field.key"
                  [(ngModel)]="values()[field.key]"
                  [name]="field.key"
                  [placeholder]="field.placeholder ?? 'dd/mm/aaaa'"
                  [disabled]="field.disabled ?? false"
                  dateFormat="dd/mm/yy"
                  styleClass="w-full"
                  (ngModelChange)="onchange()"
                />
              }
              @case ("checkbox") {
                <div class="fb-checkbox-row">
                  <p-checkbox
                    [inputId]="field.key"
                    [(ngModel)]="values()[field.key]"
                    [name]="field.key"
                    [binary]="true"
                    [disabled]="field.disabled ?? false"
                    (ngModelChange)="onchange()"
                  />
                  <label [for]="field.key" class="fb-checkbox-label">
                    {{ field.placeholder ?? field.label }}
                  </label>
                </div>
              }
              @case ("switch") {
                <div class="fb-switch-row">
                  <p-toggleswitch
                    [inputId]="field.key"
                    [(ngModel)]="values()[field.key]"
                    [name]="field.key"
                    [disabled]="field.disabled ?? false"
                    (ngModelChange)="onchange()"
                  />
                  <label [for]="field.key" class="fb-switch-label">
                    {{ values()[field.key] ? "Activado" : "Desactivado" }}
                  </label>
                </div>
              }
            }

            @if (field.hint) {
              <span class="fb-hint">{{ field.hint }}</span>
            }
          </div>
        }
      </div>

      @if (showActions()) {
        <div class="fb-actions">
          @if (showReset()) {
            <p-button
              type="button"
              [label]="resetLabel()"
              severity="secondary"
              [outlined]="true"
              (onClick)="reset()"
            />
          }
          <p-button
            type="submit"
            [label]="submitLabel()"
            [loading]="loading()"
            [disabled]="loading()"
          />
        </div>
      }
    </form>
  `,
  styles: [
    `
      .fb-root {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .fb-title {
        font-size: var(--ds-font-size-section-title, 1.25rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .fb-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 640px) {
        .fb-grid {
          grid-template-columns: 1fr;
        }
      }
      .fb-field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .fb-col-2 {
        grid-column: span 2;
      }
      @media (max-width: 640px) {
        .fb-col-2 {
          grid-column: span 1;
        }
      }
      .fb-label {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .fb-required {
        color: var(--ds-danger, #ba1a1a);
        margin-left: 2px;
      }
      .fb-hint {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .fb-checkbox-row,
      .fb-switch-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }
      .fb-checkbox-label,
      .fb-switch-label {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-primary);
        cursor: pointer;
      }
      .fb-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--ds-border, #e2e8f0);
      }
      .w-full {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppFormBuilder {
  schema = input<FormField[]>([]);
  title = input<string>("");
  initial = input<FormValues>({});
  showActions = input<boolean>(true);
  showReset = input<boolean>(true);
  submitLabel = input<string>("Guardar");
  resetLabel = input<string>("Restablecer");
  loading = input<boolean>(false);

  formChange = output<FormValues>();
  formSubmit = output<FormValues>();

  values = signal<FormValues>({});

  constructor() {
    // Initialize values from initial input (called once at creation)
    // We use a non-reactive init here because signals can't depend on input signals in constructor
  }

  ngOnInit(): void {
    const init: FormValues = { ...this.initial() };
    this.schema().forEach((f) => {
      if (!(f.key in init)) {
        init[f.key] =
          f.type === "checkbox" || f.type === "switch"
            ? false
            : f.type === "number" || f.type === "currency"
              ? null
              : "";
      }
    });
    this.values.set(init);
  }

  onchange(): void {
    this.formChange.emit({ ...this.values() });
  }

  submit(): void {
    this.formSubmit.emit({ ...this.values() });
  }

  reset(): void {
    this.ngOnInit();
    this.formChange.emit({ ...this.values() });
  }
}
