import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-tools-inventory",
  imports: [CommonModule, RouterModule],
  templateUrl: "./tools-inventory.html",
  styleUrls: ["./tools-inventory.scss"],
})
export class ToolsInventory {}
