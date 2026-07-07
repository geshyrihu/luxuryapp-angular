import { CommonModule } from "@angular/common";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "il-button-delete",
  standalone: true,
  imports: [CommonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmDelete($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:delete-outline'" />
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

  protected confirmDelete(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

