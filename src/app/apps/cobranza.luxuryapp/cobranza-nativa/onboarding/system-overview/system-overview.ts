import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-system-overview",
  imports: [LxCard, LxTag, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./system-overview.html",
})
export default class SystemOverview {}
