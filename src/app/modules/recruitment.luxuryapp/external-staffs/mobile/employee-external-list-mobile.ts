import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-employee-external-list-mobile",
  templateUrl: "./employee-external-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class EmployeeExternalListMobile {
  data = input.required<any[]>();

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  userApp = output<string>();
  removeFromCustomer = output<string>();
}
