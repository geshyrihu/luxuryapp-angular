import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { ButtonType } from "../../../enums/button-type";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-save",
  imports: [CommonModule, TooltipModule],
  template: `
    <div class="text-right">
      <button
        [type]="type() || 'submit'"
        [disabled]="disabled() || submitting()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="clicked.emit($event)"
      >
        <span [class]="iconShellClasses(true)" aria-hidden="true">
          @if (submitting()) {
            <i class="pi pi-spin pi-spinner"></i>
          } @else {
            <i [class]="finalIcon()"></i>
          }
        </span>
        <span>{{ finalLabel() }}</span>
      </button>
    </div>
  `,
})
export class CustomButtonSave extends BaseButton {
  override severity = input<any>("primary");
  override variant = input<"outlined" | "text" | null>("outlined");
  override type = input<ButtonType>(ButtonType.Submit);
  override size = input<any>("small");

  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });

  finalIcon = computed(
    () =>
      this.resolvedIconClass() ||
      (this.propertyId() ? "pi pi-sync" : "pi pi-save"),
  );
}
