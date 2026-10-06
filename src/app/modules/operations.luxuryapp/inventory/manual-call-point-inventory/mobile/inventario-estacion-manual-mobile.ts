import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioEstacionManualDto } from "@core/interfaces/inventario-estacion-manual.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-inventario-estacion-manual-mobile",
  templateUrl: "./inventario-estacion-manual-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileActionMenu,
    DataViewMobile,
  ],
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
