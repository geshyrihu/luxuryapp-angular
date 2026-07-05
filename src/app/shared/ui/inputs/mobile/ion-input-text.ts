import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * ✍️ ION INPUT TEXT - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Input de texto nativo para vistas móviles. Equivalente a custom-input-text-signal.
 */
@Component({
  selector: "ion-input-text",
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
        mode="md"
        [type]="type()"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        clearInput
        [readonly]="readonly()"
      >
        @if (requiredInput()) {
          <!-- Se inyecta estrellita roja nativamente a la par del label si es obligatorio -->
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-input>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputText),
      multi: true,
    },
  ],
})
export class IonInputText extends BaseIonicInput {
  // <--- Configuración --->
  type = input<string>("text");

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
