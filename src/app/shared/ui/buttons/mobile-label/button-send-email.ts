import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";
import { SwalService } from "@core/services/swal.service";

@Component({
  selector: "ili-button-send-email",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="resolvedIconClass() || IconCatalog.EmailOutline" slot="start" />
      {{ label() || "Enviar correo" }}
    </ion-button>
  `,
})
export class MobileButtonLabelSendEmail extends MobileButtonBase {
  private readonly swalService = inject(SwalService);
  protected override readonly IconCatalog = AppIconCatalog;
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  protected async confirmSend(): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (await this.swalService.confirm({
      title: "Confirmación",
      text: this.confirmMessage(),
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    })) {
      this.confirmed.emit();
    }
  }
}
