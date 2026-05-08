import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-confirm",
  imports: [CommonModule, TooltipModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="confirmAction($event)"
      [pTooltip]="pTooltip() || label() || 'Confirmar'"
      tooltipPosition="top"
    >
      <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
        <i [class]="finalIcon()"></i>
      </span>
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Confirmar" }}</span>
      }
    </button>
  `,
})
export class CustomButtonConfirm extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("success");
  override rounded = input<boolean>(false);

  icon = input<string>("check");
  pTooltip = input<string>("");

  swalTitle = input<string>("Confirmar");
  swalText = input<string>("Esta seguro de que desea realizar esta accion?");
  swalConfirmButtonText = input<string>("Si, confirmar");
  swalCancelButtonText = input<string>("Cancelar");
  swalIcon = input<"success" | "warning" | "info" | "question">("question");

  confirmed = output<void>();

  finalIcon = computed(() => {
    const resolvedIcon = this.resolvedIconClass();
    if (resolvedIcon) return resolvedIcon;

    const customIcon = (this.icon() || "check").trim();
    if (customIcon.startsWith("pi ")) return customIcon;
    if (customIcon.startsWith("pi-")) return `pi ${customIcon}`;
    return `pi pi-${customIcon}`;
  });

  async confirmAction(event: Event): Promise<void> {
    const result = await Swal.fire({
      title: this.swalTitle(),
      text: this.swalText(),
      icon: this.swalIcon(),
      showCancelButton: true,
      confirmButtonText: this.swalConfirmButtonText(),
      cancelButtonText: this.swalCancelButtonText(),
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
