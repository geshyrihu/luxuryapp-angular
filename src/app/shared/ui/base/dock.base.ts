import { Directive, input, output } from "@angular/core";
import type { MenuItem } from "primeng/api";

@Directive()
export abstract class DockBase {
  items = input<MenuItem[]>([]);
  position = input<"bottom" | "top" | "left" | "right">("bottom");

  itemClick = output<MenuItem>();

  protected runCommand(item: MenuItem): void {
    if (item.command) {
      item.command({ item });
    } else {
      this.itemClick.emit(item);
    }
  }
}
