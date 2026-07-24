import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
} from "@ionic/angular/standalone";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { addIcons } from "ionicons";
import { chevronBack } from "ionicons/icons";
import { HidescrollnavService } from "src/app/core/services/hidescrollnav.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { CustomerHeaderDataCommittee } from "./monitor/client-data";
import { ProfileCommitteeMonitor } from "./monitor/profile";

@Component({
  selector: "app-committee-mobile",
  imports: [
    RouterOutlet,
    AppIcon,
    CustomerHeaderDataCommittee,
    ProfileCommitteeMonitor,
    IonApp,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    LxLoader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-mobile.html",
})
export class CommitteeMobil {
  private location = inject(Location);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  public hideScroolNavService = inject(HidescrollnavService);

  constructor() {
    addIcons({ chevronBack });
  }

  onBack(): void {
    const canGoBack = this.navigationService.canGoBack();
    if (canGoBack) {
      this.location.back();
    } else {
      this.router.navigate(["/dashboard/default"]);
    }
  }
}
