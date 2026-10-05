import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { IEmployee } from "../interfaces/employee.interface";

@Component({
  selector: "app-employee-list-mobile",
  templateUrl: "./employee-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxTag,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelItem,
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
