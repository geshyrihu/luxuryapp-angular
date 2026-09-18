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
  selector: "il-button-confirm",

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
        <app-icon [icon]="resolvedIconClass() || IconCatalog.CheckCircleOutline" />
      }
      <span>{{ label() || "Confirmar" }}</span>
    </button>
  `,
})
export class WebButtonLabelConfirm extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("success");

  protected async handleConfirm(event: Event): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (await confirmAction(this.swalText())) {
      this.confirmed.emit();
    }
  }
}

