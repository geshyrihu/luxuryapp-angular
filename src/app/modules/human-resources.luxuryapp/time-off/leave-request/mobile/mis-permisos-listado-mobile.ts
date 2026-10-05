import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LeaveRequestMyDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";

@Component({
  selector: "app-mis-permisos-listado-mobile",
  templateUrl: "./mis-permisos-listado-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    MobileButtonLabelDelete,
    ApiDatePipe,
    DataViewMobile,
  ],
})
export class MisPermisosListadoMobile {
  data = input.required<LeaveRequestMyDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
