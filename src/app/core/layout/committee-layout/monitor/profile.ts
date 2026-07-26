import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PopoverModule } from "primeng/popover";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ProfielService } from "src/app/core/auth/services/profiel-service";
import { InfoAccountAuthDto } from "src/app/core/interfaces/auth-user-token.dto";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
@Component({
  selector: "app-profile-committee-monitor",
  imports: [RouterModule, PopoverModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./profile.html",
})
export class ProfileCommitteeMonitor {
  private authS = inject(AuthService);
  public updateService = inject(UpdateService);
  private consoleLogger = inject(ConsoleLoggerService);
  private profielServiceService = inject(ProfielService);
  public customerIdS = inject(CustomerIdService);
  private router = inject(Router);

  /** Modo compacto (mobile): solo avatar, sin nombre/cargo. */
  public compact = input(false);

  /** Portal externo de administración. */
  public readonly adminSiteUrl = "https://www.luxurybuildingsite.com/";

  public readonly defaultAvatar = "assets/images/default-avatar.png";
  public infoAccountAuthDTO: InfoAccountAuthDto;
  public profileImageUrl = signal("");
  public customerName = this.customerIdS.nombreCorto;

  /** Clientes a los que el usuario tiene acceso (para cambiar de customer). */
  public cb_customer: SelectItemDto[] = this.authS.customerAccess;
  public customerId = this.customerIdS.customerId;

  public profileRoute = computed(() => "/committee/profile");

  constructor() {
    this.infoAccountAuthDTO = this.authS.infoUserAuth;
    if (this.infoAccountAuthDTO) {
      this.profileImageUrl.set(this.infoAccountAuthDTO.photoPath);
    }

    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.profileImageUrl.set(nuevaImagenUrl.imagenUrl);
      },
    );
  }

  /** Fallback cuando la foto de perfil (photoPath) devuelve 404. */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src.indexOf(this.defaultAvatar) === -1) {
      img.src = this.defaultAvatar;
    }
  }

  logout() {
    this.authS.logout().subscribe();
  }

  onUpdateClick(): void {
    this.consoleLogger.custom(
      "🔄",
      "color: #FF5722; font-style: italic;",
      "[ProfileCommittee] Botón de actualización de PWA clicado.",
    );
    this.updateService.activateUpdate();
  }

  goToProfile(): void {
    this.router.navigate([this.profileRoute()]);
  }

  /** Cambia el cliente activo (si el usuario tiene acceso a más de uno). */
  selectCustomer(newCustomerId: string): void {
    if (!newCustomerId || newCustomerId === this.customerId()) return;
    this.customerIdS.setCustomerId(newCustomerId).subscribe();
  }

  /** Limpia cachés/Service Worker y recarga la app. */
  async onForceReload(): Promise<void> {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }

  /** Abre el portal externo de administración en otra pestaña. */
  openAdminSite(): void {
    window.open(this.adminSiteUrl, "_blank", "noopener");
  }
}
