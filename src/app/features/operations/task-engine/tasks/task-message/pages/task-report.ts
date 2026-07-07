import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-task-report",
  templateUrl: "./task-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule, AppIcon],
})
export class TaskReport {
  readonly ROUTES = ROUTES;
}
