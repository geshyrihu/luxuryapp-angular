import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioHidranteDto } from "@core/interfaces/inventario-hidrante.interface";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelDownload } from "@ui/buttons/mobile-label/button-download";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-hidrante-mobile",
  templateUrl: "./inventario-hidrante-mobile.html",
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
export class InventarioHidranteMobile {
  data = input.required<InventarioHidranteDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioHidranteDto>();
  delete = output<string>();
  viewHistory = output<InventarioHidranteDto>();
  downloadQr = output<InventarioHidranteDto>();
  openScanner = output<void>();
}
