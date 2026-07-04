import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-operations-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./operations-page.html",
  styleUrls: ["./operations-page.scss"],
})
export class OperationsPage {}
