import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { CustomerDataCompanyDto } from "../customer-data-company.dto";

@Component({
  selector: "app-customer-data-company-list-mobile",
  templateUrl: "./customer-data-company-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    DataViewMobile,
    MobileActionMenu,
    CustomInputSelectSignal,
    MobileListItem,
    AppIcon,
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
