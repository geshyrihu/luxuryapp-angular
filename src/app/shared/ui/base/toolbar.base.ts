import { Directive, input, TemplateRef } from "@angular/core";

@Directive()
export abstract class ToolbarBase {
  styleClass = input<string>("");
  leftTemplate = input<TemplateRef<any> | undefined>(undefined);
  rightTemplate = input<TemplateRef<any> | undefined>(undefined);
}
