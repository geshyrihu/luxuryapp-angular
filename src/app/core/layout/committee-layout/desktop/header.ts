import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CustomerHeaderDataCommittee } from "./client-data";
import { ProfileCommitteedesktop } from "./profile";
@Component({
  selector: "app-header-committee-desktop",
  imports: [CustomerHeaderDataCommittee, ProfileCommitteedesktop],
  templateUrl: "./header.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderCommitteedesktop {}
