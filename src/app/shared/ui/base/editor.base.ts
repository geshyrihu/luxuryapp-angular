import { Directive, input } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Directive()
export abstract class EditorBase implements ControlValueAccessor {
  styleClass = input<string>("");
  style = input<any>(undefined);
  placeholder = input<any>(undefined);

  _value: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(val: any): void { this._value = val; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouch = fn; }
  setDisabledState(_isDisabled: boolean): void {}
}
