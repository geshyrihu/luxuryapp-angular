import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-funding-list-mobile",
  templateUrl: "./funding-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LxTag, LxIcon, DataViewMobile, MobileListItem],
})
export class FundingListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  details = output<string>();
}
