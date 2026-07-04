import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 📅 ION INPUT DATE - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Input de fecha nativo para móviles. Usa el DateTimePicker del sistema
 * operativo (iOS/Android) para una experiencia fluida.
 */
@Component({
  selector: "ion-input-date",
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
      <ion-input
        type="date"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        [readonly]="readonly()"
        [disabled]="disabled()"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-input>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputDate),
      multi: true,
    },
  ],
})
export class IonInputDate extends BaseIonicInput {
  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
