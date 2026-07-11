import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonButtons, IonToolbar } from "@ionic/angular/standalone";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { addIcons } from "ionicons";
import { chevronBack } from "ionicons/icons";
import { CustomerHeaderDataMobile } from "src/app/core/layout/shared/customer-header-data-mobile/customer-header-data-mobile";
import { NavigationService } from "src/app/core/services/navigation.service";
import { ROUTES } from "src/app/routing/route-paths";
import { ProfileUserMobile } from "../profile-user-mobile/profile-user";
@Component({
  selector: "app-header-mobile",
  imports: [
    AppIcon,
    CustomerHeaderDataMobile,
    ProfileUserMobile,
    IonToolbar,
    IonButtons,
    IonButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header-mobile.html",
})
export class HeaderMobile {
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
      this.router.navigate(['/dashboard/default']);
    }
  }
}
