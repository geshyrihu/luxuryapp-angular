import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-staff-evaluation",
  imports: [CommonModule, RouterModule],
  templateUrl: "./staff-evaluation.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./staff-evaluation.scss"],
})
export class StaffEvaluation {}
