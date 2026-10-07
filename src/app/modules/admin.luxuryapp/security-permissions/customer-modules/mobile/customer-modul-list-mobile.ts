import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-customer-modul-list-mobile",
  templateUrl: "./customer-modul-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileListItem, LxTag, ButtonWeb, LuxDataViewMobile, LxIcon],
})
export class CustomerModulListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  state = input<boolean>(false);

  selectActive = output<boolean>();
  select = output<{ customerId: any; nameCustomer: string }>();
}
