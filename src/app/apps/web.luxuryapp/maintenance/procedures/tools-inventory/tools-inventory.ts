import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-tools-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./tools-inventory.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./tools-inventory.scss"],
})
export class ToolsInventory {}
