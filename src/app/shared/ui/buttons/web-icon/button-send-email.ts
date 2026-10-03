import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { BaseButton } from "../base/base-button";
import { SwalService } from "@core/services/swal.service";

@Component({
  selector: "iw-button-send-email",
  host: { class: "lux-button-web" },
   imports: [AppIcon, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      [lxTooltip]="tooltipText()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipDisabled]="!tooltipText()"
      (click)="confirmSend()"
    >
      <app-icon [icon]="resolvedIconClass() || IconCatalog.Email" />
    </button>
  `,
})
export class WebButtonIconSendEmail extends BaseButton {
  private readonly swalService = inject(SwalService);
  protected readonly IconCatalog = AppIconCatalog;
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("info");

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
