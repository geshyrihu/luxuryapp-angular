import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Medidor } from "@core/interfaces/medidor.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-medidores-list-mobile",
  templateUrl: "./medidores-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    ButtonMobile,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    DataViewMobile,
    AppIcon,
  ],
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
