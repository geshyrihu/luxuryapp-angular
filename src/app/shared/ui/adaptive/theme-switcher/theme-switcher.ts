import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppThemeSwitcher } from "@ui/web/theme-switcher/theme-switcher";
import { MobileThemeSwitcher } from "@ui/mobile/theme-switcher/theme-switcher";

/**
 * Wrapper multiplataforma de ThemeSwitcher. Renderiza `app-theme-switcher`
 * (botón PrimeNG) o `ili-theme-switcher` (ion-toggle) según la plataforma.
 * No hereda de la base para evitar doble aplicación del tema (cada versión
 * gestiona su propio estado/persistencia).
 * Punto de entrada recomendado: `<lx-theme-switcher />`.
 */
@Component({
  selector: "lx-theme-switcher",
  standalone: true,
  imports: [AppThemeSwitcher, MobileThemeSwitcher],
  template: `
    @if (platform.isMobile()) {
      <ili-theme-switcher />
    } @else {
      <app-theme-switcher />
    }
  `,
})
export class LxThemeSwitcher {
  protected platform = inject(PlatformService);
}
