import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 💰 ION INPUT CURRENCY - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Input para manejar divisas en vistas móviles.
 * Utiliza el teclado numérico del dispositivo.
 */
@Component({
  selector: "ion-input-currency",
  imports: [BaseIonicInput, ReactiveFormsModule, IonInput],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <!-- "money" icono no existe nativo dentro de input, pero podemos colocarlo en template si es necesario -->
      <!-- prefix() set dynamically based on input binding -->
      <div style="display: flex; align-items: center; width: 100%;">
        <ion-input
          type="number"
          inputmode="decimal"
          [id]="id()"
          [formControl]="control() || internalControl"
          [label]="label()"
          [placeholder]="placeholder()"
          label-placement="floating"
        mode="md"
        fill="outline"
          [readonly]="readonly()"
          [step]="0.01"
          clearInput
          style="flex: 1;"
        >
          @if (prefix()) {
            <span slot="start" style="padding-right: 8px; font-weight: 500;">{{
              prefix()
            }}</span>
          }
          @if (requiredInput()) {
            <div slot="label" style="color: var(--ion-color-danger)">*</div>
          }
        </ion-input>
      </div>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputCurrency),
      multi: true,
    },
  ],
})
export class IonInputCurrency extends BaseIonicInput {
  // <--- Configuración --->
  prefix = input<string | undefined>("$ "); // Prefijo de moneda por defecto

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
