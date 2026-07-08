import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

export interface PhonePrefixOption {
  code: string;
  label: string;
  mask: string;
}

@Component({
  selector: "ion-input-phone-prefix",
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
          @for (opt of prefixes(); track opt.code) {
            <ion-select-option [value]="opt.code">{{ opt.label }}</ion-select-option>
          }
        </ion-select>
        <ion-input
          mode="md"
          type="tel"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          fill="outline"
          inputmode="tel"
          [readonly]="readonly()"
          style="flex: 1;"
        />
      </div>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputPhonePrefix), multi: true },
  ],
})
export class IonInputPhonePrefix extends BaseIonicInput {
  prefixes = input<PhonePrefixOption[]>([
    { code: "+52", label: "🇲🇽 +52", mask: "(000) 000-0000" },
    { code: "+1", label: "🇺🇸 +1", mask: "(000) 000-0000" },
    { code: "+34", label: "🇪🇸 +34", mask: "000 000 000" },
    { code: "+57", label: "🇨🇴 +57", mask: "000 000 0000" },
  ]);
  selectedPrefix = input("+52");

  onPrefixChange(code: string): void {
    const ctrl = this.control() || this.internalControl;
    ctrl.markAsDirty();
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
