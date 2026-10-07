import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioEstacionManualDto } from "@core/interfaces/inventario-estacion-manual.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-inventario-estacion-manual-mobile",
  templateUrl: "./inventario-estacion-manual-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonMobile, LxIcon, MobileActionMenu, LuxDataViewMobile],
})
export class InventarioEstacionManualMobile {
  data = input.required<InventarioEstacionManualDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<InventarioEstacionManualDto>();
  delete = output<string>();
  viewHistory = output<InventarioEstacionManualDto>();
  downloadQr = output<InventarioEstacionManualDto>();
  downloadPdf = output<void>();
  openScanner = output<void>();
  deleteAll = output<void>();
}
