import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 🔢 ION INPUT NUMBER - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Input numérico general para dispositivos móviles.
 * Utiliza el teclado numérico nativo del celular.
 */
@Component({
  selector: "ion-input-number",
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
      <!-- Mode decimal triggers number pad on iOS/Android -->
      <ion-input
        type="number"
        inputmode="decimal"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        shape="round"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        clearInput
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-input>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputNumber),
      multi: true,
    },
  ],
})
export class IonInputNumber extends BaseIonicInput {
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number>(1);

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
