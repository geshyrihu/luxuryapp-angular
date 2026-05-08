import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InfoAccountAuthDTO } from "src/app/core/interfaces/auth-user-token.dto";
import { AuthService } from "src/app/core/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ProfielService } from "src/app/core/services/profiel-service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
@Component({
  selector: "app-profile-committee-monitor",
  imports: [CommonModule, RouterModule],
  templateUrl: "./profile-committee-monitor.html",
})
export class ProfileCommitteeMonitor {
  private authS = inject(AuthService);
  public updateService = inject(UpdateService);
  private consoleLogger = inject(ConsoleLoggerService);
  private profielServiceService = inject(ProfielService);
  public customerIdS = inject(CustomerIdService);
  public isMenuVisible: boolean = false;
  public infoAccountAuthDTO: InfoAccountAuthDTO;
  public profileImageUrl: string = "";
  public customerName = this.customerIdS.nombreCorto;

  constructor() {
    this.infoAccountAuthDTO = this.authS.infoUserAuth;
    if (this.infoAccountAuthDTO) {
      this.profileImageUrl = this.infoAccountAuthDTO.photoPath;
    }

    this.profielServiceService.imagenPerfilActualizada$.subscribe(
      (nuevaImagenUrl: any) => {
        this.profileImageUrl = nuevaImagenUrl.imagenUrl;
      },
    );
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  closeMenu() {
    this.isMenuVisible = false;
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
}









