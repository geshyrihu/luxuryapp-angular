import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-legal-page",
  imports: [CommonModule, RouterModule],
  templateUrl: "./legal-page.html",
  styleUrls: ["./legal-page.scss"],
})
export class LegalPage {}
