import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import Swal from "sweetalert2";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-delete",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="confirmDelete($event)"
      [pTooltip]="ngbTooltip() || label() || 'Eliminar'"
      [tooltipPosition]="tooltipPosition()"
    >
      <span
        [class]="iconShellClasses(showLabelOnDesktop() && !!label())"
        aria-hidden="true"
      >
        <app-icon [icon]="finalIcon()" />
      </span>
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButtonDelete extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("danger");
  override rounded = input<boolean>(true);
  override size = input<any>("small");

  confirmHeader = input<string>("Confirmar");
  confirmMessage = input<string>(
    "Esta seguro de que desea eliminar este registro?",
  );
  confirmAcceptLabel = input<string>("Si, eliminar");
  confirmRejectLabel = input<string>("Cancelar");

  isLinked = input<boolean>(false);
  confirmLinkedMessage = input<string>(
    "Este registro esta vinculado a una o mas ordenes de servicio. Si lo elimina, las ordenes de servicio quedaran desvinculadas. Esta seguro de que desea continuar?",
  );

  confirmed = output<void>();

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:delete");

  async confirmDelete(event: Event): Promise<void> {
    const message = this.isLinked()
      ? this.confirmLinkedMessage()
      : this.confirmMessage();

    const result = await Swal.fire({
      title: this.confirmHeader(),
      text: message,
      icon: "warning",
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
