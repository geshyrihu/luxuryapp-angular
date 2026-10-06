import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { IEmployee } from "../interfaces/employee.interface";

import { ButtonMobile } from "@ui/buttons/mobile";
@Component({
  selector: "app-employee-list-mobile",
  templateUrl: "./employee-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxTag,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class EmployeeListMobile {
  data = input.required<IEmployee[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  editEmpleado = output<{
    applicationUserId: string;
    employeeId: string;
    fullName: string;
  }>();
}
