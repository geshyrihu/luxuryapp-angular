import { Component } from "@angular/core";
import { ToolbarModule } from "primeng/toolbar";
import { ProfileCommitteeMobile } from "../../../shared/profile-user-mobile/profile-user";
import { CustomerHeaderDataCommittee } from "../components/customer-header-data-committee/customer-header-data-committee";
@Component({
  selector: "app-header-committee-monitor",
  imports: [CustomerHeaderDataCommittee, ToolbarModule, ProfileCommitteeMobile],
  templateUrl: "./header-committee-monitor.html",
  styleUrl: "./header-committee-monitor.scss",
})
export class HeaderCommitteeMonitor {}









