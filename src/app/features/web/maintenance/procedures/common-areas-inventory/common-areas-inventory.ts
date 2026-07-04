import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-common-areas-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./common-areas-inventory.html",
  styleUrls: ["./common-areas-inventory.scss"],
})
export class CommonAreasInventory {}
