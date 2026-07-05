import { Component, forwardRef, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonToggle } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

/**
 * 🔄 ION INPUT TOGGLE - Mobile (Ionic)
 * -------------------------------------------------------------------------
 * Interruptor On/Off con estilo nativo iOS/Android.
 * Equivalente al custom-input-switch-signal de PrimeNG.
 */
@Component({
  selector: "ion-input-toggle",
  imports: [BaseIonicInput, ReactiveFormsModule, IonToggle],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-toggle
        slot="end"
        [id]="id()"
        [formControl]="control() || internalControl"
        (ionChange)="onToggleChange($event)"
      >
        @if (placeholder()) {
          {{ placeholder() }}
        }
      </ion-toggle>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputToggle),
      multi: true,
    },
  ],
})
export class IonInputToggle extends BaseIonicInput {
  toggleChange = output<boolean>();

  onToggleChange(event: any): void {
    this.toggleChange.emit(event.detail.checked);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
