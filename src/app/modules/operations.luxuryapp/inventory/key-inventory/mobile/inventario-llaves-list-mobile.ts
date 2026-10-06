import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioLlave } from "@core/interfaces/inventario-llave.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-llaves-list-mobile",
  templateUrl: "./inventario-llaves-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class InventarioLlavesListMobile {
  data = input.required<InventarioLlave[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioLlave>();
  delete = output<string>();
  downloadPdf = output<void>();
}
