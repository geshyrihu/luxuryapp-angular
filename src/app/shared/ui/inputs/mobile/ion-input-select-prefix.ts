import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-select-prefix",
  imports: [BaseIonicInput, ReactiveFormsModule, IonInput, IonSelect, IonSelectOption],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <div style="display: flex; gap: 8px; align-items: flex-start;">
        <ion-select
          [value]="selectedPrefix()"
          (ionChange)="onPrefixChange($event.detail.value)"
          interface="popover"
          style="min-width: 100px;"
          [disabled]="readonly()"
        >
          @for (opt of prefixOptions(); track opt.value) {
            <ion-select-option [value]="opt.value">{{ opt.label }}</ion-select-option>
          }
        </ion-select>
        <ion-input
          mode="md"
          type="text"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          fill="outline"
          [readonly]="readonly()"
          style="flex: 1;"
        />
      </div>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputSelectPrefix), multi: true },
  ],
})
export class IonInputSelectPrefix extends BaseIonicInput {
  prefixOptions = input<{ value: string; label: string }[]>([]);
  selectedPrefix = input("");

  onPrefixChange(value: string): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.markAsDirty();
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
