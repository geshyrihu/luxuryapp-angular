import { Directive, input, model } from "@angular/core";
import type { MenuItem } from "primeng/api";

@Directive()
export abstract class MenubarBase {
  items = input<MenuItem[]>([]);
  orientation = input<"horizontal" | "vertical">("horizontal");

  activeItem = model<MenuItem | null>(null);

  protected runCommand(item: MenuItem, event?: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
