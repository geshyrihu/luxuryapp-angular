import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-purchase-request",
  imports: [RouterModule],
  templateUrl: "./purchase-request.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./purchase-request.scss"],
})
export class PurchaseRequest {}
