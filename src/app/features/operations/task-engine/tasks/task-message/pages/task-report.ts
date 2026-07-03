import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-task-report",
  templateUrl: "./task-report.html",
  imports: [RouterModule, AppIcon],
})
export class TaskReport {
  readonly ROUTES = ROUTES;
}
