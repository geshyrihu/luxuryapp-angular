import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class EditorBase {
  styleClass = input<string>("");
  formControlName = input<any>(undefined);
  formControl = input<any>(undefined);
  style = input<any>(undefined);
  placeholder = input<any>(undefined);
}
