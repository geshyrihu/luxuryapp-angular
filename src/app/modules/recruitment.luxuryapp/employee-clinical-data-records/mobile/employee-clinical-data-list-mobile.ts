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
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { IEmployeeClinicalData } from "../interfaces/employee-clinical-data.interface";

@Component({
  selector: "app-employee-clinical-data-list-mobile",
  templateUrl: "./employee-clinical-data-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileActionMenu,
    ButtonMobile,
    MobileButtonLabelDelete,
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
