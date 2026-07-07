import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ToastModule } from "primeng/toast";

/**
 * 🍞 CUSTOM TOAST
 * -------------------------------------------------------------------------
 * Wrapper preconfigurado para las notificaciones Toast de PrimeNG.
 * Posición, z-index y animaciones listas para usar.
 */
@Component({
  selector: "primeng-custom-toast",
  imports: [ToastModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p-toast
      position="top-left"
      [baseZIndex]="99999"
      [showTransformOptions]="'translateY(-100%)'"
      [hideTransformOptions]="'translateY(100%)'"
      [showTransitionOptions]="'1000ms'"
      [hideTransitionOptions]="'1000ms'"
    />
  `,
})
export class PrimeNgCustomToast {}
