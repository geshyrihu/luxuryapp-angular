import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-send-email",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="confirmSend($event)"
      [pTooltip]="pTooltip() || label() || 'Enviar correo'"
      tooltipPosition="top"
    >
      <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
        <app-icon [icon]="finalIcon()" />
      </span>
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Enviar" }}</span>
      }
    </button>
  `,
})
export class CustomButtonSendEmail extends BaseButton {
  override text = input<boolean>(true);
  override rounded = input<boolean>(true);

  pTooltip = input<string>("");
  confirmHeader = input<string>("Enviar correo electronico");
  confirmMessage = input<string>("Desea enviar el correo electronico ahora?");
  confirmAcceptLabel = input<string>("Si, enviar");
  confirmRejectLabel = input<string>("Cancelar");

  confirmed = output<void>();

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:email-outline");

  async confirmSend(event: Event): Promise<void> {
    const result = await Swal.fire({
      title: this.confirmHeader(),
      text: this.confirmMessage(),
      icon: "info",
      showCancelButton: true,
      confirmButtonText: this.confirmAcceptLabel(),
      cancelButtonText: this.confirmRejectLabel(),
      reverseButtons: true,
      focusConfirm: false,
      focusCancel: false,
      customClass: { container: "my-swal-container" },
    });

    if (result.isConfirmed) {
      this.confirmed.emit();
    }
  }
}
