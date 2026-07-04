import { Location } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { IonButton, IonButtons, IonToolbar } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronBack } from "ionicons/icons";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { NavigationService } from "src/app/core/services/navigation.service";
import { CustomerHeaderDataMobile } from "src/app/layout/shared/customer-header-data-mobile/customer-header-data-mobile";
import { ProfileCommitteeMobile } from "../profile-user-mobile/profile-user";
@Component({
  selector: "app-header-mobile",
  imports: [
    AppIcon,
    CustomerHeaderDataMobile,
    ProfileCommitteeMobile,
    IonToolbar,
    IonButtons,
    IonButton,
  ],
  templateUrl: "./header-mobile.html",
})
export class HeaderCommitteeMobile {
  private location = inject(Location);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  constructor() {
    addIcons({ chevronBack });
  }

  onBack(): void {
    const canGoBack = this.navigationService.canGoBack();

    if (canGoBack) {
      this.location.back();
    } else {
      this.router.navigate(ROUTES.COMITE.HOME);
    }
  }
}
