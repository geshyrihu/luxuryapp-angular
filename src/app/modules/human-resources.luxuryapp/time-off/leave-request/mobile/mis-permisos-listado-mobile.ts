import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LeaveRequestMyDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from '@ui/adaptive/icon/icon';
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";

@Component({
  selector: "app-mis-permisos-listado-mobile",
  templateUrl: "./mis-permisos-listado-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
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
