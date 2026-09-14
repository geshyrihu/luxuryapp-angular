import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-toggle-switch",

  imports: [BaseInputSignal, ReactiveFormsModule],
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
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          [formControl]="control() || internalControl"
          [id]="id()"
          [disabled]="disabled()"
          (change)="onValueChange($event)"
        />
      </div>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputToggleSwitch),
      multi: true,
    },
  ],
})
export class WebInputToggleSwitch
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
