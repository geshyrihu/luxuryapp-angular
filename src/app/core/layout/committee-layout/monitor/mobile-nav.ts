import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  BottomNavItem,
  MobileBottomNav,
} from "@ui/mobile/bottom-nav/bottom-nav";
import { AuthService } from "src/app/core/auth/services/auth.service";

@Component({
  selector: "app-committee-mobile-nav",
  imports: [MobileBottomNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./mobile-nav.html",
})
export class CommitteeMobileNav {
  private authS = inject(AuthService);
  private router = inject(Router);

  public activeId = signal("inicio");

  public items: BottomNavItem[] = [
    { id: "inicio", icon: "mdi:home-variant", label: "Inicio" },
    { id: "directorio", icon: "mdi:card-account-details-outline", label: "Directorio" },
    { id: "perfil", icon: "mdi:account-cog", label: "Perfil" },
    { id: "salir", icon: "mdi:logout", label: "Salir" },
  ];

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
