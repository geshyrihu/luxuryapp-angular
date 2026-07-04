import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-hr-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./hr-page.html",
  styleUrls: ["./hr-page.scss"],
})
export class HrPage {}
