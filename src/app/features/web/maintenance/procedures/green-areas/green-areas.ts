import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-green-areas",
  imports: [CommonModule, RouterModule],
  templateUrl: "./green-areas.html",
  styleUrls: ["./green-areas.scss"],
})
export class GreenAreas {}
