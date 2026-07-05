import { Component, forwardRef, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonCheckbox } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * ☑️ ION INPUT CHECKBOX - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Casilla de verificación nativa para formularios móviles.
 */
@Component({
  selector: "ion-input-checkbox",
  imports: [BaseIonicInput, ReactiveFormsModule, IonCheckbox],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-checkbox
        slot="end"
        [id]="id()"
        [formControl]="control() || internalControl"
        (ionChange)="onCheckboxChange($event)"
      >
        @if (placeholder()) {
          {{ placeholder() }}
        }
      </ion-checkbox>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputCheckbox),
      multi: true,
    },
  ],
})
export class IonInputCheckbox extends BaseIonicInput {
  checkChange = output<boolean>();

  onCheckboxChange(event: any): void {
    this.checkChange.emit(event.detail.checked);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
