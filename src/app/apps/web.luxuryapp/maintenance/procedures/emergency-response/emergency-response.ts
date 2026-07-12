import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-emergency-response",
  imports: [RouterModule],
  templateUrl: "./emergency-response.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./emergency-response.scss"],
})
export class EmergencyResponse {}
