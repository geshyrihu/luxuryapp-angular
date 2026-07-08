import { Directive, input } from "@angular/core";

@Directive()
export abstract class BlockUIBase {
  blocked = input<boolean>(false);
  fullScreen = input<boolean>(false);
}
