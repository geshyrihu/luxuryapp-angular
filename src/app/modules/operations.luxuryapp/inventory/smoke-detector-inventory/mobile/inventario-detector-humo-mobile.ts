import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioDetectorHumoDto } from "@core/interfaces/inventario-detector-humo.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-detector-humo-mobile",
  templateUrl: "./inventario-detector-humo-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDownload,
    MobileButtonLabelDelete,
    DataViewMobile,
  ],
})
export class InventarioDetectorHumoMobile {
  data = input.required<InventarioDetectorHumoDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioDetectorHumoDto>();
  delete = output<string>();
  viewHistory = output<InventarioDetectorHumoDto>();
  downloadQr = output<InventarioDetectorHumoDto>();
  downloadPdf = output<void>();
  openScanner = output<void>();
  deleteAll = output<void>();
}
