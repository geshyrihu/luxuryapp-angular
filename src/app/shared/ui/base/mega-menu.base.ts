import { Directive, input } from "@angular/core";
import type { MegaMenuItem } from "primeng/api";

@Directive()
export abstract class MegaMenuBase {
  items = input.required<MegaMenuItem[]>();
  orientation = input<"horizontal" | "vertical">("horizontal");

  protected runCommand(item: MegaMenuItem, event?: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
