import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-asset-disposal",
  imports: [CommonModule, RouterModule],
  templateUrl: "./asset-disposal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./asset-disposal.scss"],
})
export class AssetDisposal {}
