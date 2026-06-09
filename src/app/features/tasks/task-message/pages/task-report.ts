import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
@Component({
  selector: "app-task-report",
  templateUrl: "./task-report.html",
  imports: [RouterModule, AppIcon],
})
export class TaskReport {}
