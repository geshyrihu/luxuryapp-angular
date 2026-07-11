import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-common-areas-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./common-areas-inventory.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./common-areas-inventory.scss"],
})
export class CommonAreasInventory {}
