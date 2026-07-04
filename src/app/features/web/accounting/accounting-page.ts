import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-accounting-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./accounting-page.html",
  styleUrls: ["./accounting-page.scss"],
})
export class AccountingPage {}
