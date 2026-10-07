import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-funding-accounting-list-mobile",
  templateUrl: "./funding-accounting-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxIcon, MobileListItem, LuxDataViewMobile],
})
export class FundingAccountingListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  details = output<string>();
}
