import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ValidationErrorsCustomInput } from "./validation-errors-custom-input";

@Component({
  selector: "base-ionic-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorsCustomInput],
  template: `
    @if (!hidden()) {
      <div [class]="hostClass()">
        @if (!onlyInput() && label()) {
          <label class="block text-sm font-semibold text-700 mb-2">
            {{ label() }}
            @if (requiredInput()) {
              <span class="text-red-500">*</span>
            }
          </label>
        }
        <div class="w-full">
          <ng-content />
        </div>
        @if (description()) {
          <small class="block mt-2 text-600">{{ description() }}</small>
        }
        <app-validation-errors-custom-input
          [control]="control() || internalControl"
        />
      </div>
    }
  `,
})
export class BaseIonicInput implements ControlValueAccessor {
  control = input<FormControl<any> | null>(null);
  id = input<string>("");
  label = input<string>("");
  placeholder = input<string>("");
  readonly = input<boolean>(false);
  requiredInput = input<boolean>(false, { alias: "required" });
  hidden = input<boolean>(false);
  description = input<string>("");
  horizontal = input<boolean>(false);
  noMargin = input<boolean>(false);
  onlyInput = input<boolean>(false);
  disabled = input<boolean>(false);
  hostClass = input<string>("");

  internalControl = new FormControl<any>(null);
  protected onChange: (value: any) => void = () => {};
  protected onTouch: () => void = () => {};

  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.internalControl.valueChanges.subscribe((value) => fn(value));
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.internalControl.disable({ emitEvent: false })
      : this.internalControl.enable({ emitEvent: false });
  }
}
