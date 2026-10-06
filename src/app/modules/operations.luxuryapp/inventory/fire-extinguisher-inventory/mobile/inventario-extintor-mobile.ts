import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioExtintorDto } from "@core/interfaces/inventario-extintor.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-inventario-extintor-mobile",
  templateUrl: "./inventario-extintor-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    MobileActionMenu,
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
