import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "il-button-confirm",

  imports: [CommonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleConfirm($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else {
        <app-icon [icon]="iconClass() || 'mdi:check-circle-outline'" />
      }
      <span>{{ label() || "Confirmar" }}</span>
    </button>
  `,
})
export class WebButtonLabelConfirm extends BaseButton {
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("success");

  protected handleConfirm(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.swalText())) {
      this.confirmed.emit();
    }
  }
}
