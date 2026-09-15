import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonToolbar,
} from "@ionic/angular";
import { LxLoader } from "@ui/adaptive/loader/loader";
import { addIcons } from "ionicons";
import { chevronBack } from "ionicons/icons";
import { HidescrollnavService } from "@core/services/hidescrollnav.service";
import { NavigationService } from "@core/services/navigation.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CustomerHeaderDataCommittee } from "./desktop/client-data";
import { CommitteeMobileNav } from "./desktop/mobile-nav";
import { ProfileCommitteedesktop } from "./desktop/profile";

@Component({
  selector: "app-committee-mobile",
  imports: [
    RouterOutlet,
    AppIcon,
    CustomerHeaderDataCommittee,
    ProfileCommitteedesktop,
    CommitteeMobileNav,
    IonApp,
    IonContent,
    IonHeader,
    IonFooter,
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

