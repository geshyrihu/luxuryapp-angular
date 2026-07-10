import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AvatarModule } from "primeng/avatar";
import { PopoverModule } from "primeng/popover";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ProfielService } from "src/app/core/auth/services/profiel-service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";

@Component({
  selector: "app-profile-monitor",
  imports: [RouterModule, PopoverModule, AvatarModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./profile-monitor.html",
})
export class ProfileMonitor {
  updateService = inject(UpdateService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  profielServiceService = inject(ProfielService);
  router = inject(Router);
  private consoleLogger = inject(ConsoleLoggerService);

  infoAccountAuthDTO: InfoAccountAuthDTO;
  profileImageUrl: string = "";
  customerPhotoPath = this.customerIdS.customerPhotoPath();

  profileRoute = computed(() =>
    this.aspRoleS.roleSignal(EApplicationRole.Direccion)()
      ? "/direccion/profile/update-user-profile"
      : "/profile/update-user-profile",
  );

  navigateToProfile() {
    this.router.navigate([this.profileRoute()]);
  }

  navigateToPasswordManager() {
    this.router.navigate(["/password-manager"]);
  }

  constructor() {
    effect(() => {
      const currentCustomerId = this.customerIdS.customerId();
      if (currentCustomerId) {
        this.customerPhotoPath = this.customerIdS.customerPhotoPath();
      }
    });
    this.infoAccountAuthDTO = this.authS.infoUserAuth;
    this.profileImageUrl = this.infoAccountAuthDTO.photoPath;

    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.profileImageUrl = nuevaImagenUrl.imagenUrl;
      },
    );
  }

  logOut() {
    this.authS.logout().subscribe();
  }

  onUpdateClick(): void {
    this.consoleLogger.custom(
      "🔄",
      "color: #FF5722; font-style: italic;",
      "[ProfileMonitor] Botón de actualización de PWA clicado.",
    );
    this.updateService.activateUpdate();
  }
}
