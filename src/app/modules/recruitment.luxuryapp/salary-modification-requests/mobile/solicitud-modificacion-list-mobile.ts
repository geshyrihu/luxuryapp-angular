import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-solicitud-modificacion-list-mobile",
  templateUrl: "./solicitud-modificacion-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    ButtonMobile,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class SolicitudModificacionListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
