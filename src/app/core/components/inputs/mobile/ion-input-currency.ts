import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { BaseIonicInput } from "../base/base-ionic-input";

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
      [hidden]="hidden()"
      [description]="description()"
      [horizontal]="horizontal()"
      [noMargin]="noMargin()"
      [onlyInput]="onlyInput()"
      [class]="inputStyleClass()"
    >
      <div style="display: flex; align-items: center; width: 100%;">
        <ion-input
          type="number"
          inputmode="decimal"
          [id]="id()"
          [formControl]="control() || internalControl"
          [label]="label()"
          [placeholder]="placeholder()"
          label-placement="floating"
          fill="outline"
          [readonly]="readonly()"
          [disabled]="disabled()"
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputCurrency),
      multi: true,
    },
  ],
})
export class IonInputCurrency extends BaseIonicInput {
  prefix = input<string | undefined>("$ ");
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " input-sm";
    if (this.size() === "large") classes += " input-lg";
    return classes.trim();
  });

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
