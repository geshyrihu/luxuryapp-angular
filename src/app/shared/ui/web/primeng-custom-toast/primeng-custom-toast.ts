import { ChangeDetectionStrategy, Component } from "@angular/core";
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
  template: ` <p-toast position="top-left" [baseZIndex]="99999" /> `,
})
export class PrimeNgCustomToast {}
