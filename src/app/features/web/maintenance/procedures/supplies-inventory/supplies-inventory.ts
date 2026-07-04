import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-supplies-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./supplies-inventory.html",
  styleUrls: ["./supplies-inventory.scss"],
})
export class SuppliesInventory {}
