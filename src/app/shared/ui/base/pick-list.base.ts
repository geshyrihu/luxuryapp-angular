import { Directive, model } from "@angular/core";

@Directive()
export abstract class PickListBase {
  source = model<any[]>([]);
  target = model<any[]>([]);
}
