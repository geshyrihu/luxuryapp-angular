import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioLlave } from "@core/interfaces/inventario-llave.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-llaves-list-mobile",
  templateUrl: "./inventario-llaves-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelDownload,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
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
