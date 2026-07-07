import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";

/**
 * 🔢 TOUCHSPIN
 * -------------------------------------------------------------------------
 * Input numérico con botones de incremento y decremento.
 * Ideal para cantidades, con validación de mínimo y máximo.
 */
@Component({
  selector: "app-touchspin",
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    TooltipModule,
  ],
  template: `
    <p-inputgroup>
      <!-- 1. Addon con fondo blanco y botón rojo -->
      <p-inputgroup-addon styleClass="surface-card">
        <p-button
          label="➖"
          (onClick)="decrement()"
          [disabled]="disabled() || isMin()"
          [outlined]="outlined()"
          pTooltip="Disminuir"
          tooltipPosition="top"
          size="small"
        />
      </p-inputgroup-addon>

      <input
        pInputText
        class="text-center"
        style="width: 60px"
        type="number"
        [formControl]="control()"
        [min]="minValue()"
        [max]="maxValue()"
        [disabled]="disabled()"
        readonly
        pSize="small"
      />

      <!-- 2. Addon con fondo blanco y botón verde -->
      <p-inputgroup-addon styleClass="surface-card">
        <p-button
          label="➕"
          (onClick)="increment()"
          [disabled]="disabled() || isMax()"
          [outlined]="outlined()"
          pTooltip="Aumentar"
          tooltipPosition="top"
          size="small"
        />
      </p-inputgroup-addon>
    </p-inputgroup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      /* Estos estilos siguen siendo útiles */
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `,
  ],
})
export class Touchspin {
  // <--- Inputs --->
  control = input.required<FormControl>();
  minValue = input<number>(1);
  maxValue = input<number>(5);
  step = input<number>(1);
  disabled = input<boolean>(false);
  outlined = input<boolean>(true);

  // <--- Outputs --->
  valueChanged = output<number>();

  increment(): void {
    if (this.disabled() || this.isMax()) return;
    const currentVal = this.control().value || 0;
    const newValue = Math.min(currentVal + this.step(), this.maxValue());
    this.updateValue(newValue);
  }

  decrement(): void {
    if (this.disabled() || this.isMin()) return;
    const currentVal = this.control().value || 0;
    const newValue = Math.max(currentVal - this.step(), this.minValue());
    this.updateValue(newValue);
  }

  private updateValue(value: number): void {
    this.control().setValue(value);
    this.control().markAsTouched();
    this.control().markAsDirty();
    this.valueChanged.emit(value);
  }

  // Getters convertidos a helpers para el template (invocar como funciones)
  isMin(): boolean {
    return (this.control().value || 0) <= this.minValue();
  }

  isMax(): boolean {
    return (this.control().value || 0) >= this.maxValue();
  }
}
