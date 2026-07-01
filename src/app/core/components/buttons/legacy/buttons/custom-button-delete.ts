import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-delete",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="confirmDelete($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:delete'" />
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Eliminar" }}</span>
      }
    </button>
  `,
})
export class CustomButtonDelete extends WebButtonBase {
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("danger");

  protected confirmDelete(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}
