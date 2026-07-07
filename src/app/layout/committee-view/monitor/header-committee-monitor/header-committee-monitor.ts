import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ToolbarModule } from "primeng/toolbar";
import { ProfileUserMobile } from "../../../shared/profile-user-mobile/profile-user";
import { CustomerHeaderDataCommittee } from "../components/customer-header-data-committee/customer-header-data-committee";
@Component({
  selector: "app-header-committee-monitor",
  imports: [CustomerHeaderDataCommittee, ToolbarModule, ProfileUserMobile],
  templateUrl: "./header-committee-monitor.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./header-committee-monitor.scss",
})
export class HeaderCommitteeMonitor {}









