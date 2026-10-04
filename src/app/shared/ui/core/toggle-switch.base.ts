import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class ToggleSwitchBase {
  checked = model<boolean>(false);
  disabled = input<boolean>(false);
  inputId = input<string>("");
  label = input<string>("");
}
