import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class CascadeSelectBase {
  options = input<any[]>([]);
  value = model<any>(null);
  optionLabel = input<string>("label");
  placeholder = input<string>("Seleccionar...");
}
