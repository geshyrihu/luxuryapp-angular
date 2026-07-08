import { Directive, input } from "@angular/core";

export type DividerLayout = "horizontal" | "vertical";

@Directive()
export abstract class DividerBase {
  layout = input<DividerLayout>("horizontal");
}
