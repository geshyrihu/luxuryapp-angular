import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-user-activity-history-mobile",
  templateUrl: "./user-activity-history-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    LxCard,
    LxTag,
    DataViewMobile,
    MobileListItem,
    LxIcon],
})
export class UserActivityHistoryMobile {
  data = input.required<any[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  globalFilterFields = input<string[]>([]);

  search = output<string>();
  loadMore = output<void>();
}
