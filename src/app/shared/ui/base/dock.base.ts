import { Directive, input, output } from "@angular/core";

import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import type { MenuItem } from "primeng/api";

@Directive()
export abstract class DockBase {
  items = input<MenuItem[]>([]);
  position = input<"bottom" | "top" | "left" | "right">("bottom");

  itemClick = output<MenuItem>();

  /** Resuelve un nombre/clase/legacy a AppIconName para el binding de app-icon. */
  protected iconName(value: string | null | undefined): AppIconName {
    return resolveIconifyIcon(value) as AppIconName;
  }

  protected runCommand(item: MenuItem): void {
    if (item.command) {
      item.command({ item });
    } else {
      this.itemClick.emit(item);
    }
  }
}
