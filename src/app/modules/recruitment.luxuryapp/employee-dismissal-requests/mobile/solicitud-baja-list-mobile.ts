import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import type { SolicitudBajaListItem } from "../solicitud-baja-list";

@Component({
  selector: "app-solicitud-baja-list-mobile",
  templateUrl: "./solicitud-baja-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
  ],
})
export class SolicitudBajaListMobile {
  data = input.required<SolicitudBajaListItem[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<SolicitudBajaListItem>();
  delete = output<string>();
}
