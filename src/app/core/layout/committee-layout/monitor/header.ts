import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CustomerHeaderDataCommittee } from "./client-data";
import { ProfileCommitteeMonitor } from "./profile";
@Component({
  selector: "app-header-committee-monitor",
  imports: [CustomerHeaderDataCommittee, ProfileCommitteeMonitor],
  templateUrl: "./header.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCommitteeMonitor {}
