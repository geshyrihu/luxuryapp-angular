import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { DrawerModule } from "primeng/drawer";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { ProfielService } from "src/app/core/services/profiel-service";
import { UpdateService } from "src/app/core/services/update-pwa.service";

@Component({
  selector: "app-profile-monitor",
  imports: [
    RouterModule,
    FormsModule,
    DrawerModule,
    AvatarModule,
    AvatarGroupModule,
    CustomButton,
    AppIcon,
  ],
  templateUrl: "./profile-monitor.html",
})
export class ProfileMonitor {
  public profileDrawerVisible = signal(false);
  updateService = inject(UpdateService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);

  profileRoute = computed(() =>
    this.aspRoleS.roleSignal(EApplicationRole.Direccion)()
      ? "/direccion/profile/update-user-profile"
      : "/profile/update-user-profile",
  );
  customerIdS = inject(CustomerIdService);
  profielServiceService = inject(ProfielService);
  router = inject(Router);
  private consoleLogger = inject(ConsoleLoggerService);
  infoAccountAuthDTO: InfoAccountAuthDTO;
  profileImageUrl: string = "";
  customerPhotoPath = this.customerIdS.customerPhotoPath();

  constructor() {
    // Mantiene sincronizada la foto del customer visible en el selector superior.
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
