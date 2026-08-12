import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";
import { ConfirmService } from "../shared/confirm.service";

@Component({
  selector: "il-button-delete",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmDelete($event)"
    >
      <app-icon [icon]="resolvedIconClass() || 'material-symbols-light:delete-outline'" />
      <span>{{ label() || "Eliminar" }}</span>
    </button>
  `,
})
export class WebButtonLabelDelete extends BaseButton {
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
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
