import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-installation-inspection",
  imports: [RouterModule],
  templateUrl: "./installation-inspection.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./installation-inspection.scss"],
})
export class InstallationInspection {}
