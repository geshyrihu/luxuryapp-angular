import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ProfielService } from "@core/auth/services/profiel-service";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { InfoAccountAuthDto } from "@core/interfaces/auth-user-token.dto";
import { ConsoleLoggerService } from "@core/services/console-logger.service";
import { UpdateService } from "@core/services/update-pwa.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppPopover } from "@ui/web/popover/popover";
import { AppAvatar } from "@ui/web/avatar/avatar";

@Component({
  selector: "app-profile-desktop",
  imports: [RouterModule, AppPopover, AppAvatar, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./profile-desktop.html",
})
export class Profiledesktop {
  updateService = inject(UpdateService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  profielServiceService = inject(ProfielService);
  router = inject(Router);
  private consoleLogger = inject(ConsoleLoggerService);

  infoAccountAuthDTO: InfoAccountAuthDto;
  profileImageUrl: string = "";
  customerPhotoPath = this.customerIdS.customerPhotoPath();

  profileRoute = computed(() =>
    this.aspRoleS.roleSignal(ApplicationRole.Direccion)()
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
      "??",
      "color: #FF5722; font-style: italic;",
      "[Profiledesktop] Botón de actualización de PWA clicado.",
    );
    this.updateService.activateUpdate();
  }
}

