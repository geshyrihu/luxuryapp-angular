import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";
import { SwalService } from "@core/services/swal.service";

@Component({
  selector: "ili-button-confirm",

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
      (click)="handleConfirm($event)"
    >
      <app-icon
        [icon]="resolvedIconClass() || IconCatalog.CheckCircleOutline"
        slot="start"
      />
      {{ label() || "Confirmar" }}
    </ion-button>
  `,
})
export class MobileButtonLabelConfirm extends MobileButtonBase {
  private readonly swalService = inject(SwalService);
  protected override readonly IconCatalog = AppIconCatalog;
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  protected async handleConfirm(event: Event): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (await this.swalService.confirm({
      title: "Confirmación",
      text: this.swalText(),
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    })) {
      this.confirmed.emit();
    }
  }
}
