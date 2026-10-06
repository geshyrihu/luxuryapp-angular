import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-system-overview",
  imports: [LxCard, LxTag, LxIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./system-overview.html",
})
export default class SystemOverview {}

