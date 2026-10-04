import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class CheckboxBase {
  checked = model<boolean>(false);
  binary = input<boolean>(true);
  disabled = input<boolean>(false);
  inputId = input<string>("");
  label = input<string>("");
}
