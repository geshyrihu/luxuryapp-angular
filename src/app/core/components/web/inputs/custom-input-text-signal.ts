import { Component, forwardRef, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-text-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <input
          [type]="type()"
          pInputText
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
          [readOnly]="readonly()"
          [class]="customClass()"
          [pSize]="size() ?? mobileSize()"
          [invalid]="isInvalid()"
          [attr.list]="list()"
          fluid
        />
        @if (label()) {
          <label [for]="id()">
            {{ label() }}
            @if (isRequired()) { <span style="color:var(--ds-danger)"> *</span> }
          </label>
        }
      </p-floatlabel>
    </base-input-signal>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputTextSignal),
    multi: true,
  }],
})
export class CustomInputTextSignal extends BaseInputSignal implements ControlValueAccessor {
  constructor() { super(); }
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  type = input<string>("text");
  list = input<string | undefined>(undefined);
  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
  override writeValue(obj: any): void { super.writeValue(obj); }
  override setDisabledState(isDisabled: boolean): void { super.setDisabledState(isDisabled); }
}

