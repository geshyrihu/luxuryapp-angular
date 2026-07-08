import { Directive, input, model } from "@angular/core";

@Directive()
export abstract class InplaceBase {
  active = model<boolean>(false);
  closable = input<boolean>(true);
}
