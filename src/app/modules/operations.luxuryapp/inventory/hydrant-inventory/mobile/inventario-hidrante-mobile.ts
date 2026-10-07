import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { InventarioHidranteDto } from "@core/interfaces/inventario-hidrante.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-inventario-hidrante-mobile",
  templateUrl: "./inventario-hidrante-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonMobile, LxIcon, MobileActionMenu, LuxDataViewMobile],
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
