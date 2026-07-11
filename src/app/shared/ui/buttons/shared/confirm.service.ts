import { inject, Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular/standalone";
import { SweetAlertIcon } from "src/app/core/interfaces/sweetalert-icon.enum";
import { PlatformService } from "src/app/core/services/platform.service";
import Swal from "sweetalert2";

@Injectable({ providedIn: "root" })
export class ConfirmService {
  private readonly platform = inject(PlatformService);
  private readonly alertCtrl = inject(AlertController);

  async confirm(
    message: string,
    header: string = "Confirmar",
  ): Promise<boolean> {
    return this.platform.isMobile()
      ? this.confirmMobile(message, header)
      : this.confirmWeb(message, header);
  }

  private async confirmWeb(message: string, header: string): Promise<boolean> {
    const result = await Swal.fire({
      title: header,
      text: message,
      icon: SweetAlertIcon.Question,
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });
    return result.isConfirmed;
  }

  private confirmMobile(message: string, header: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.alertCtrl
        .create({
          header,
          message,
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => resolve(false),
            },
            {
              text: "Si, eliminar",
              role: "destructive",
              handler: () => resolve(true),
            },
          ],
        })
        .then((alert) => alert.present());
    });
  }
}
