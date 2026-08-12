import { Directive, input, model } from "@angular/core";

import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import type { MenuItem } from "primeng/api";

@Directive()
export abstract class ContextMenuBase {
  items = input.required<MenuItem[]>();

  /** Mobile: controla visibilidad del popover contextual */
  visible = model<boolean>(false);

  /** Resuelve un nombre/clase/legacy a AppIconName para el binding de app-icon. */
  protected iconName(value: string | null | undefined): AppIconName {
    return resolveIconifyIcon(value) as AppIconName;
  }

  protected runCommand(item: MenuItem, event?: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
