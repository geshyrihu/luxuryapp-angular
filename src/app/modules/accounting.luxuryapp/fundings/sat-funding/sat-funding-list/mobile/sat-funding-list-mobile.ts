import { SatFundingDto } from "@accounting.luxuryapp/general-ledger/sat-funding/interfaces/sat-funding.interface";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-sat-funding-list-mobile",
  templateUrl: "./sat-funding-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LxIcon, MobileListItem, DataViewMobile],
})
export class SatFundingListMobile {
  data = input.required<SatFundingDto[]>();
}
