import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CustomerDataCompanyDto } from "../customer-data-company.dto";

@Component({
  selector: "app-customer-data-company-list-mobile",
  templateUrl: "./customer-data-company-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    FormsModule,
    ReactiveFormsModule,
    DataViewMobile,
    MobileActionMenu,
    LuxInputSelectSignal,
    MobileListItem,
    LxIcon,
  ],
})
export class CustomerDataCompanyListMobile {
  data = input.required<CustomerDataCompanyDto[]>();
  sortedData = input.required<CustomerDataCompanyDto[]>();
  globalFilterFields = input<string[]>([]);
  groupingOptions = input<{ label: string; value: string }[]>([]);
  groupingOption = input<string>("numeroCliente");
  groupingOptionControl = input<FormControl<string> | null>(null);

  add = output<any>();
  edit = output<any>();
  delete = output<string>();
  groupingChange = output<string>();
}
