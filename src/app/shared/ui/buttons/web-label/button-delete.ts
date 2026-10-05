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
import { BaseButton, type ButtonDisplayMode } from "../base/base-button";
import { ConfirmService } from "../shared/confirm.service";

@Component({
  selector: "il-button-delete",

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
      [attr.aria-label]="ariaLabel() || title() || label() || 'Eliminar'"
      (click)="confirmDelete($event)"
    >
      @if (displayMode() !== "label") {
        <app-icon [icon]="resolvedIconClass() || IconCatalog.DeleteOutline" />
      }
      @if (displayMode() !== "icon") {
        <span>{{ label() || "Eliminar" }}</span>
      }
    </button>
  `,
})
export class WebButtonLabelDelete extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  override displayMode = input<ButtonDisplayMode>("both");
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("danger");

  private readonly confirmSvc = inject(ConfirmService);

  protected async confirmDelete(event: Event): Promise<void> {
    if (this.disabled() || this.loading()) return;
    if (
      await this.confirmSvc.confirm(this.confirmMessage(), this.confirmHeader())
    ) {
      this.confirmed.emit();
    }
  }
}
