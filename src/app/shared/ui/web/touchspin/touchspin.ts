import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

/**
 * 🔢 TOUCHSPIN
 * -------------------------------------------------------------------------
 * Input numérico con botones de incremento y decremento.
 * Ideal para cantidades, con validación de mínimo y máximo.
 */
@Component({
  selector: "app-touchspin",
  imports: [ReactiveFormsModule, LxTooltipDirective, WebButtonLabel],
  template: `
    <div class="input-group" style="width: auto">
      <span class="input-group-text surface-card p-0">
        <il-button
          label="➖"
          (clicked)="decrement()"
          [disabled]="disabled() || isMin()"
          [variant]="outlined() ? 'outline' : 'solid'"
          lxTooltip="Disminuir"
          tooltipPosition="top"
          size="sm"
        />
      </span>

      <input
        class="form-control form-control-sm text-center"
        style="width: 60px"
        type="number"
        [formControl]="control()"
        [min]="minValue()"
        [max]="maxValue()"
        [disabled]="disabled()"
        readonly
      />

      <span class="input-group-text surface-card p-0">
        <il-button
          label="➕"
          (clicked)="increment()"
          [disabled]="disabled() || isMax()"
          [variant]="outlined() ? 'outline' : 'solid'"
          lxTooltip="Aumentar"
          tooltipPosition="top"
          size="sm"
        />
      </span>
    </div>
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
