import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-mask",
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
        type="text"
        [id]="id()"
        [formControl]="control() || internalControl"
        [label]="label()"
        [placeholder]="placeholder()"
        label-placement="floating"
        fill="outline"
        [readonly]="readonly()"
        (ionInput)="onInput($event)"
      >
        @if (requiredInput()) {
          <div slot="label" style="color: var(--ion-color-danger)">*</div>
        }
      </ion-input>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputMask), multi: true },
  ],
})
export class IonInputMask extends BaseIonicInput {
  customMask = input.required<string>();

  onInput(event: any): void {
    const input = event.target as HTMLIonInputElement;
    const raw = (input.value as string) || "";
    const masked = this.applyMask(raw, this.customMask());
    input.value = masked;
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(masked);
    this.onChange(masked);
  }

  private applyMask(value: string, mask: string): string {
    let result = "";
    let valueIndex = 0;
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      if (mask[i] === "0" || mask[i] === "9") {
        if (/\d/.test(value[valueIndex])) {
          result += value[valueIndex];
          valueIndex++;
        } else {
          valueIndex++;
          i--;
        }
      } else {
        result += mask[i];
        if (value[valueIndex] === mask[i]) valueIndex++;
      }
    }
    return result;
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
