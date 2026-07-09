import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class MultiselectBase {
  styleClass = input<string>("");
  options = input<any>(undefined);
  placeholder = input<any>(undefined);
  optionLabel = input<any>(undefined);
  ngModel = model<any>(undefined);
  onChange = output<any>();
}
