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
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-employee-emergency-contact-list-mobile",
  templateUrl: "./employee-emergency-contact-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
  ],
})
export class EmployeeEmergencyContactListMobile {
  dataEmergencyContact = input.required<any[]>();
  dataBeneficiary = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);

  add = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  edit = output<{
    id: string;
    title: string;
    contacOfBeneficiary: number;
  }>();
  delete = output<{ id: string; typeContact: number }>();
}
