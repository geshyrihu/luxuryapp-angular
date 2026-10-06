import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { IEmployeeClinicalData } from "../interfaces/employee-clinical-data.interface";

@Component({
  selector: "app-employee-clinical-data-list-mobile",
  templateUrl: "./employee-clinical-data-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
  ],
})
export class EmployeeClinicalDataListMobile {
  data = input.required<IEmployeeClinicalData[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
