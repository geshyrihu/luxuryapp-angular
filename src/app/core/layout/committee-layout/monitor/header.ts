import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ToolbarModule } from "primeng/toolbar";
import { CustomerHeaderDataCommittee } from "./client-data";
import { ProfileCommitteeMonitor } from "./profile";
@Component({
  selector: "app-header-committee-monitor",
  imports: [CustomerHeaderDataCommittee, ToolbarModule, ProfileCommitteeMonitor],
  templateUrl: "./header.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./header.scss",
})
export class HeaderCommitteeMonitor {}
