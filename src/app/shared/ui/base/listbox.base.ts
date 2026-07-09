import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class ListboxBase {
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
  formControlName = input<any>(undefined);
}
