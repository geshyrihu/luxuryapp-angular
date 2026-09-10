import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-machinery-survey",
  imports: [RouterModule],
  templateUrl: "./machinery-survey.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./machinery-survey.scss"],
})
export class MachinerySurvey {}
