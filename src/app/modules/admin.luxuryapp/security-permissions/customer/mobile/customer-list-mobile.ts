import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { CustomerDto } from "../interfaces/customer.dto";

@Component({
  selector: "app-customer-list-mobile",
  templateUrl: "./customer-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    ButtonWeb,
    MobileActionMenu,
    MobileListItem,
    AppIcon,
    DataViewMobile,
  ],
})
export class CustomerListMobile {
  data = input.required<CustomerDto[]>();
  globalFilterFields = input<string[]>([]);
  state = input<boolean>(false);
  stateOptions = input<SelectItemDto[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  updateImages = output<string>();
  updateAddress = output<string>();
  manageLocations = output<{ id: string; name?: string }>();
  sortChange = output<boolean>();

  getStateLabel(stateValue: number): string {
    const found = this.stateOptions().find((opt) => opt.value === stateValue);
    return found?.label ?? "Desconocido";
  }
}
