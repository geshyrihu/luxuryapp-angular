import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { IEmployeeBeneficiary } from "../interfaces/employee-beneficiary.interface";

@Component({
  selector: "app-employee-beneficiary-list-mobile",
  templateUrl: "./employee-beneficiary-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxIcon, MobileActionMenu, ButtonMobile, LuxDataViewMobile],
})
export class EmployeeBeneficiaryListMobile {
  data = input.required<IEmployeeBeneficiary[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
