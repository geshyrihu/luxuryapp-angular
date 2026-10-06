import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AccountingCatalogWithParent } from "../interfaces/AccountingCatalogWithParent";

@Component({
  selector: "app-accounting-catalog-mobile",
  templateUrl: "./accounting-catalog-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewMobile, MobileListItem, LxIcon],
})
export class AccountingCatalogMobile {
  data = input.required<AccountingCatalogWithParent[]>();
  globalFilterFields = input<string[]>([]);
}
