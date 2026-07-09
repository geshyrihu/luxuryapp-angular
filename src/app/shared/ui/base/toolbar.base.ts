import { Directive, input, model, output } from "@angular/core";

@Directive()
export abstract class ToolbarBase {
  styleClass = input<string>("");
}
