import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { EmployeeFileSummaryDTO } from "../interfaces/employee-file.interfaces";

import { ButtonMobile } from "@ui/buttons/mobile";
@Component({
  selector: "app-employee-file-list-mobile",
  templateUrl: "./employee-file-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    LuxDataViewMobile,
  ],
})
export class EmployeeFileListMobile {
  data = input.required<EmployeeFileSummaryDTO[]>();

  viewFile = output<EmployeeFileSummaryDTO>();

  getStatusBadge(isActive: boolean): string {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-slate-100 text-slate-600 border-slate-200";
  }
}
