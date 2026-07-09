import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class RadiobuttonBase {
  styleClass = input<string>("");
  value = input<any>(undefined);
  formControl = input<any>(undefined);
  inputId = input<any>(undefined);
}
