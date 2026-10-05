import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import {
  CustomerLocationType,
  CustomerLocationTypeLabels,
} from "../interfaces/customer-location-type.enum";
import { CustomerLocationDto } from "../interfaces/customer-location.dto";

@Component({
  selector: "app-customer-location-list-mobile",
  templateUrl: "./customer-location-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileListItem,
  ],
})
export class CustomerLocationListMobile {
  data = input.required<CustomerLocationDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<CustomerLocationDto>();
  delete = output<string>();

  getLocationTypeLabel(type: string): string {
    return CustomerLocationTypeLabels[type as CustomerLocationType] || type;
  }
}
