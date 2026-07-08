import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class TreeSelectBase {
  options = input<any[]>([]);
  value = model<any>(null);
  selectionMode = input<"single" | "multiple" | "checkbox">("single");
}
