import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-machinery-survey",
  imports: [CommonModule, RouterModule],
  templateUrl: "./machinery-survey.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./machinery-survey.scss"],
})
export class MachinerySurvey {}
