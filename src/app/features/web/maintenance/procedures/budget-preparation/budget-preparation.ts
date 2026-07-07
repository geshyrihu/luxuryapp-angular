import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-budget-preparation",
  imports: [CommonModule, RouterModule],
  templateUrl: "./budget-preparation.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./budget-preparation.scss"],
})
export class BudgetPreparation {}
