import { Directive, input } from "@angular/core";

@Directive()
export abstract class InputIconBase {
  styleClass = input<string>("");
}
