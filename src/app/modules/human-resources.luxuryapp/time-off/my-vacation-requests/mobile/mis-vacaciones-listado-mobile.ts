import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { VacationRequestMyDTO } from "@human-resources.luxuryapp/interfaces/vacation-request.interface";
import { getStatusSeverity } from "@human-resources.luxuryapp/shared/helpers/status-severity.helper";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from '@ui/adaptive/icon/icon';

@Component({
  selector: "app-mis-vacaciones-listado-mobile",
  templateUrl: "./mis-vacaciones-listado-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LxTag,
    DataViewMobile,
  ],
})
export class MisVacacionesListadoMobile {
  data = input.required<VacationRequestMyDTO[]>();

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  detail = output<string>();

  getStatusSeverity = getStatusSeverity;
}
