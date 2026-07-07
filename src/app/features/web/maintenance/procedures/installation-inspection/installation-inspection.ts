import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-installation-inspection",
  imports: [CommonModule, RouterModule],
  templateUrl: "./installation-inspection.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./installation-inspection.scss"],
})
export class InstallationInspection {}
