import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import type { SolicitudBajaListItem } from "../solicitud-baja-list";

@Component({
  selector: "app-solicitud-baja-list-mobile",
  templateUrl: "./solicitud-baja-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
  ],
})
export class SolicitudBajaListMobile {
  data = input.required<SolicitudBajaListItem[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<SolicitudBajaListItem>();
  delete = output<string>();
}
