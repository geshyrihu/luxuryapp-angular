import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-staff-evaluation",
  imports: [RouterModule],
  templateUrl: "./staff-evaluation.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./staff-evaluation.scss"],
})
export class StaffEvaluation {}
