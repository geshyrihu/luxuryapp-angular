import { Location } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonToolbar,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronBack } from "ionicons/icons";
import { NavigationService } from "src/app/core/services/navigation.service";
import { CustomerHeaderDataMobile } from "src/app/layout/shared/customer-header-data-mobile/customer-header-data-mobile";
import { ProfileCommitteeMobile } from "../profile-user-mobile/profile-user";
@Component({
  selector: "app-header-mobile",
  imports: [
    CustomerHeaderDataMobile,
    ProfileCommitteeMobile,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
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
      this.router.navigateByUrl("/committee");
    }
  }
}









