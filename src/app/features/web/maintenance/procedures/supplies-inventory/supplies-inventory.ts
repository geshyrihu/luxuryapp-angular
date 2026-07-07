import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-supplies-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./supplies-inventory.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./supplies-inventory.scss"],
})
export class SuppliesInventory {}
