import { Component, forwardRef, inject, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-text-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule, IonInput],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [noMargin]="noMargin()"
      [description]="description()"
      [hidden]="hidden()"
    >
      @if (platform.isMobile()) {
        <ion-input
          [type]="type()"
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          clearInput
          [readonly]="readonly()"
        />
      } @else {
        <input
          [type]="type()"
          pInputText
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [readOnly]="readonly()"
          [class]="customClass()"
          [pSize]="size()"
          [invalid]="isInvalid()"
          [attr.list]="list()"
          fluid
        />
      }
    </base-input-signal>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTextSignal),
      multi: true,
    },
  ],
})
export class CustomInputTextSignal extends BaseInputSignal implements ControlValueAccessor {

  constructor() {
    super();
  }

  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  type = input<string>("text");
  list = input<string | undefined>(undefined);

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
  override writeValue(obj: any): void { super.writeValue(obj); }
  override setDisabledState(isDisabled: boolean): void { super.setDisabledState(isDisabled); }
}
