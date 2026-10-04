import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioExtintorDto } from "@core/interfaces/inventario-extintor.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-extintor-mobile",
  templateUrl: "./inventario-extintor-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDownload,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class InventarioExtintorMobile {
  data = input.required<InventarioExtintorDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioExtintorDto>();
  delete = output<string>();
  viewHistory = output<InventarioExtintorDto>();
  downloadPdf = output<void>();
  openScanner = output<void>();
  bulkExpiration = output<void>();
  downloadQr = output<InventarioExtintorDto>();
}
