import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { BaseButton } from "../base/base-button";
import { SwalService } from "@core/services/swal.service";

@Component({
  selector: "il-button-send-email",

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
      <lux-icon [icon]="resolvedIconClass() || IconCatalog.EmailOutline" />
      <span>{{ label() || "Enviar correo" }}</span>
    </button>
  `,
})
export class WebButtonLabelSendEmail extends BaseButton {
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
