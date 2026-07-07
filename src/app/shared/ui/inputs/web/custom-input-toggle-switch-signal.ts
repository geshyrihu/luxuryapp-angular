import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-toggle-switch-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, ToggleSwitchModule],
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
      <p-toggleswitch
        [formControl]="control() || internalControl"
        [size]="size()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="isInvalid()"
        (onChange)="onValueChange($event)"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputToggleSwitch),
      multi: true,
    },
  ],
})
export class CustomInputToggleSwitch
  extends BaseInputSignal
  implements ControlValueAccessor
{
  toggleChange = output<any>();
  size = input<"small" | "large" | undefined>(undefined);

  constructor() {
    super();
  }

  onValueChange(event: any): void {
    this.onChange(event.checked !== undefined ? event.checked : event);
    this.onTouch();
    this.toggleChange.emit(event);
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  override writeValue(obj: any): void {
    super.writeValue(obj);
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
  }
}
