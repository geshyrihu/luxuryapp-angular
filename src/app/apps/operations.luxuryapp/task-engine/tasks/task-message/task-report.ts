import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-task-report",
  templateUrl: "./task-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, AppIcon],
})
export class TaskReport {
  readonly ROUTES = ROUTES;
}
