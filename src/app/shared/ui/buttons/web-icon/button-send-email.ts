import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "iw-button-send-email",

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
  protected readonly IconCatalog = AppIconCatalog;
  confirmMessage = input<string>("Deseas enviar el correo electronico ahora?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("info");

  protected confirmSend(): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}
