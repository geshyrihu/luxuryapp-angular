import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Base para componentes de overlay de procesamiento con indicador de progreso.
 * Define las propiedades comunes que comparten las versiones web y mobile.
 */
@Component({
  selector: "base-processing-overlay",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingOverlayBase {
  isProcessing = input<boolean>(false);
  progress = input<number>(0);
  message = input<string>("Procesando...");
  submessage = input<string | null>(null);
}
