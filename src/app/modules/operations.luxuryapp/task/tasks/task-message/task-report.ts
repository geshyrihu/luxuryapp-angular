import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { LxIcon } from "@ui/adaptive/icon/icon";
@Component({
  selector: "app-task-report",
  templateUrl: "./task-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, LxIcon],
})
export class TaskReport {
  readonly ROUTES = ROUTES;
}

