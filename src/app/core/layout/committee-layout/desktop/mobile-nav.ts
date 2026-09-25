import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/angular";
import { addIcons } from "ionicons";
import {
  homeOutline,
  logOutOutline,
  peopleOutline,
  personOutline,
} from "ionicons/icons";

@Component({
  selector: "app-committee-mobile-nav",
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./mobile-nav.html",
})
export class CommitteeMobileNav {
  private authS = inject(AuthService);
  private router = inject(Router);

  public activeId = signal("inicio");

  constructor() {
    addIcons({
      homeOutline,
      peopleOutline,
      personOutline,
      logOutOutline,
    });
  }

  onNav(id: string): void {
    switch (id) {
      case "inicio":
        this.router.navigate(["/committee"]);
        break;
      case "directorio":
        this.router.navigate(["/committee/directorio"]);
        break;
      case "perfil":
        this.router.navigate(["/committee/profile"]);
        break;
      case "salir":
        this.authS.logout().subscribe();
        break;
    }
  }
}
