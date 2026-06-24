import { Component, forwardRef, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../base/base-input-signal";
import { IonInputText } from "../mobile/ion-input-text";

@Component({
  selector: "custom-input-text-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule, IonInputText],
  template: `
    @if (platform.isMobile()) {
      <ion-input-text
        [control]="control()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [type]="type()"
        [customClass]="customClass()"
        [size]="size()"
      />
    } @else {
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
      </base-input-signal>
    }
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
