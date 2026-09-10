import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-supplier-site-control",
  imports: [RouterModule],
  templateUrl: "./supplier-site-control.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./supplier-site-control.scss"],
})
export class SupplierSiteControl {}
