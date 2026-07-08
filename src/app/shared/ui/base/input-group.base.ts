import { Directive, input } from "@angular/core";

@Directive()
export abstract class InputGroupBase {
  addonBefore = input<string>("");
  addonAfter = input<string>("");
}
