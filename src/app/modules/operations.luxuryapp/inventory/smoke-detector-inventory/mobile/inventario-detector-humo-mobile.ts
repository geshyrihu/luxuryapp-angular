import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioDetectorHumoDto } from "@core/interfaces/inventario-detector-humo.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-inventario-detector-humo-mobile",
  templateUrl: "./inventario-detector-humo-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonMobile, LxIcon, MobileActionMenu, LuxDataViewMobile],
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
