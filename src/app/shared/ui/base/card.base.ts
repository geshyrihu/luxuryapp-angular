import { Directive, input } from "@angular/core";

@Directive()
export abstract class CardBase {
  header = input<string>("");
  subheader = input<string>("");
  padded = input<boolean>(true);
  elevated = input<boolean>(false);
}
