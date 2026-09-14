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
    { id: "inicio", icon: "material-symbols-light:home", label: "Inicio" },
    { id: "directorio", icon: "material-symbols-light:badge-outline", label: "Directorio" },
    { id: "perfil", icon: "material-symbols-light:manage-accounts", label: "Perfil" },
    { id: "salir", icon: "material-symbols-light:logout", label: "Salir" },
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
