import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

import { ButtonMobile } from "@ui/buttons/mobile";
@Component({
  selector: "app-employee-beneficiary-list-mobile",
  templateUrl: "./employee-beneficiary-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class EmployeeBeneficiaryListMobile {
  data = input.required<any[]>();

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
