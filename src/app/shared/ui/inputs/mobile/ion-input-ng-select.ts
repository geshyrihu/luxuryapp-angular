import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-ng-select",
  imports: [BaseIonicInput, ReactiveFormsModule, IonSelect, IonSelectOption],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <ion-select
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        interface="action-sheet"
        [disabled]="readonly()"
      >
        @for (opt of options(); track opt.value) {
          <ion-select-option [value]="opt.value">{{ opt.label }}</ion-select-option>
        }
      </ion-select>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputNgSelect), multi: true },
  ],
})
export class IonInputNgSelect extends BaseIonicInput {
  options = input<{ value: any; label: string }[]>([]);

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
