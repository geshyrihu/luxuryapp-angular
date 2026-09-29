import { inject, Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";

@Injectable({ providedIn: "root" })
export class ConfirmService {
  private readonly platform = inject(PlatformService);
  private readonly alertCtrl = inject(AlertController);
  private readonly swalService = inject(SwalService);

  async confirm(
    message: string,
    header: string = "Confirmar",
  ): Promise<boolean> {
    return this.platform.isMobile()
      ? this.confirmMobile(message, header)
      : this.confirmWeb(message, header);
  }

  private async confirmWeb(message: string, header: string): Promise<boolean> {
    return this.swalService.confirm({
      title: header,
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
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
