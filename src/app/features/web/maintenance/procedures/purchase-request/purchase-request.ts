import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-purchase-request",
  imports: [CommonModule, RouterModule],
  templateUrl: "./purchase-request.html",
  styleUrls: ["./purchase-request.scss"],
})
export class PurchaseRequest {}
