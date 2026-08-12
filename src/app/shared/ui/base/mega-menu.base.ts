import { Directive, input } from "@angular/core";

import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";
import type { MegaMenuItem } from "primeng/api";

@Directive()
export abstract class MegaMenuBase {
  items = input.required<MegaMenuItem[]>();
  orientation = input<"horizontal" | "vertical">("horizontal");

  /** Resuelve un nombre/clase/legacy a AppIconName para el binding de app-icon. */
  protected iconName(value: string | null | undefined): AppIconName {
    return resolveIconifyIcon(value) as AppIconName;
  }

  protected runCommand(item: MegaMenuItem, event?: Event): void {
    item.command?.({ originalEvent: event, item });
  }
}
