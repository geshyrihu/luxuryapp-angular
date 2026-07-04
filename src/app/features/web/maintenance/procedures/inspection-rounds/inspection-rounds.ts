import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-inspection-rounds",
  imports: [CommonModule, RouterModule],
  templateUrl: "./inspection-rounds.html",
  styleUrls: ["./inspection-rounds.scss"],
})
export class InspectionRounds {}
