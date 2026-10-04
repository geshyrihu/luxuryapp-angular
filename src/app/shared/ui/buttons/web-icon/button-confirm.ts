import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { SwalService } from "@core/services/swal.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-confirm",
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
      (click)="handleConfirm($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else {
        <lux-icon [icon]="resolvedIconClass() || IconCatalog.CheckCircle" />
      }
    </button>
  `,
})
export class WebButtonIconConfirm extends BaseButton {
  private readonly swalService = inject(SwalService);
  protected readonly IconCatalog = AppIconCatalog;
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("success");

  protected async handleConfirm(event: Event): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (
      await this.swalService.confirm({
        title: "Confirmación",
        text: this.swalText(),
        icon: "warning",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        focusCancel: true,
      })
    ) {
      this.confirmed.emit();
    }
  }
}
