import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-supplies-inventory",
  imports: [RouterModule],
  templateUrl: "./supplies-inventory.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./supplies-inventory.scss"],
})
export class SuppliesInventory {}
