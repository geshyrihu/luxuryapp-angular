import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { VacationBalanceAdminViewDto } from "../../../interfaces/vacation-balance-admin-view.interface";

@Component({
  selector: "app-admin-vacaciones-balance-mobile",
  templateUrl: "./admin-vacaciones-balance-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxConfirmDialog,
    LxTag,
    ButtonMobile,
    DataViewMobile,
    MobileListItem,
    AppIcon,
    ApiDatePipe,
  ],
})
export class AdminVacacionesBalanceMobile {
  data = input.required<VacationBalanceAdminViewDto[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<VacationBalanceAdminViewDto>();
}
