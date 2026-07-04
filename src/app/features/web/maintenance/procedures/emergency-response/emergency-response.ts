import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-emergency-response",
  imports: [CommonModule, RouterModule],
  templateUrl: "./emergency-response.html",
  styleUrls: ["./emergency-response.scss"],
})
export class EmergencyResponse {}
