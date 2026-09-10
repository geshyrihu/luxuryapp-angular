import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-supplier-review",
  imports: [RouterModule],
  templateUrl: "./supplier-review.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./supplier-review.scss"],
})
export class SupplierReview {}
