import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-green-areas",
  imports: [CommonModule, RouterModule],
  templateUrl: "./green-areas.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./green-areas.scss"],
})
export class GreenAreas {}
