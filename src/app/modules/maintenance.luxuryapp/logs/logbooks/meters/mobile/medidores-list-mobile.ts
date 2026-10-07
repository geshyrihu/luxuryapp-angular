import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Medidor } from "@core/interfaces/medidor.interface";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-medidores-list-mobile",
  templateUrl: "./medidores-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileActionMenu, ButtonMobile, LuxDataViewMobile, LxIcon],
})
export class MedidoresListMobile {
  data = input.required<Medidor[]>();

  add = output<{ id: number; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  registerReading = output<Medidor>();
  goToLecturas = output<any>();
  goToGrafico = output<any>();
  exportExcel = output<any>();
}
