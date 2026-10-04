import { Directive, input, model } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Directive()
export abstract class ListboxBase implements ControlValueAccessor {
  styleClass = input<string>("");
  options = input<any>(undefined);
  optionLabel = input<any>(undefined);
  optionValue = input<any>(undefined);
  multiple = input<any>(undefined);
  checkbox = input<any>(undefined);
  filter = input<any>(undefined);
  style = input<any>(undefined);
  listStyle = input<any>(undefined);
  emptyFilterMessage = input<any>(undefined);
  group = input<any>(undefined);
  optionGroupLabel = input<any>(undefined);
  optionGroupChildren = input<any>(undefined);
  metaKeySelection = input<any>(undefined);
  value = model<any>(undefined);

  onChangeCva: any = () => {};
  onTouchCva: any = () => {};

  writeValue(val: any): void {
    this.value.set(val);
  }
  registerOnChange(fn: any): void { this.onChangeCva = fn; }
  registerOnTouched(fn: any): void { this.onTouchCva = fn; }
  setDisabledState(_isDisabled: boolean): void {}
}
