import { Directive, input, model } from "@angular/core";
import type { MenuItem } from "primeng/api";

@Directive()
export abstract class ContextMenuBase {
  items = input.required<MenuItem[]>();

  /** Mobile: controla visibilidad del popover contextual */
  visible = model<boolean>(false);

  protected runCommand(item: MenuItem, event?: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
